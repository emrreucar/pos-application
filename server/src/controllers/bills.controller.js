import { mssql, poolPromise } from "../lib/db.js";
import nodemailer from "nodemailer";

// GET /bills -> Get all bills
export const getBills = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkiniz yok!" });
  }

  try {
    const pool = await poolPromise;

    // 1. tüm faturaları getir
    const query = `
        SELECT 
            b.id,
            b.customer_id,
            b.total_amount,
            b.payment_method_id,
            b.status,
            FORMAT(b.created_at, 'yyyy-MM-dd HH:mm') AS created_at,
            c.name + ' ' + c.surname AS customer_name_surname,
            pm.name AS payment_method
        FROM bills b
        JOIN customers c ON b.customer_id = c.id
        JOIN payment_methods pm ON b.payment_method_id = pm.id
        ORDER BY b.created_at DESC
        
        `;

    const billsResult = await pool.request().query(query);

    const bills = billsResult.recordset;

    if (bills.length === 0) {
      return res.status(200).json([]);
    }

    // 2. her fatura için, fatura kalemlerini getir
    const billIds = bills.map((bill) => bill.id);

    // her fatura için ödeme kalemlerini de getir
    const totalPaymentsResult = await pool.query(`
      SELECT
        bill_id,
        SUM(amount) AS total_paid
      FROM bill_payments
      WHERE bill_id IN (${billIds.join(",")})
      GROUP BY bill_id
    `);

    const paymentItemsResult = await pool.query(`
  SELECT
    bp.id,
    bp.bill_id,
    bp.amount,
    bp.payment_date,
    pm.name AS payment_method
  FROM bill_payments bp
  JOIN payment_methods pm ON bp.payment_method_id = pm.id
  WHERE bp.bill_id IN (${billIds.join(",")})
`);

    // 3. tüm item'leri topluca çek
    const itemsResult = await pool.query(`SELECT 
        bi.bill_id,
        bi.quantity,
        bi.unit_price,
        bi.quantity * bi.unit_price AS total_price,
        p.title,
        p.image_url
      FROM bill_items bi
      JOIN products p ON bi.product_id = p.id
      WHERE bi.bill_id IN (${billIds.join(",")})
    `);

    const allItems = itemsResult.recordset;
    const totalPayments = totalPaymentsResult.recordset;
    const allPaymentItems = paymentItemsResult.recordset;

    // 4. her faturaya ait item'leri eşleştir
    const billsWithItems = bills.map((bill) => {
      return {
        ...bill,
        cart_items: allItems.filter((item) => item.bill_id === bill.id),
        payments: allPaymentItems.filter((p) => p.bill_id === bill.id),
        total_paid:
          totalPayments.find((p) => p.bill_id === bill.id)?.total_paid || 0,
      };
    });

    res.status(200).json(billsWithItems);
  } catch (error) {
    console.log("Faturaları getirirken hata: ", error);
    return res.status(500).json({ message: "Faturaları getirirken hata!" });
  }
};

// GET /bills/:id -> Get a bill by ID
export const getBill = async (req, res) => {};

// POST /bills -> Create a new bill
export const createBill = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const { customer_id, payment_method_id, cart_items } = req.body;

  if (
    !customer_id ||
    !payment_method_id ||
    !Array.isArray(cart_items) ||
    cart_items.length === 0
  ) {
    return res.status(400).json({ message: "Geçersiz veri gönderildi" });
  }

  let transaction;

  try {
    const pool = await poolPromise;
    // transaction amacı -> Tüm işlemlerin otomatik olarak ya hepsinin başarılı olması ya da hepsinin geri alınması
    // örnek -> fatura kalemlerini eklerken bir sorun çıkarsa, faturayı ve kalemlerini geri al
    transaction = new mssql.Transaction(pool);
    await transaction.begin();

    // TÜM STOĞU KONTROL ET
    for (const item of cart_items) {
      const stockCheckResult = await transaction
        .request()
        .input("product_id", item.product_id)
        .query("SELECT stock, title FROM products WHERE id = @product_id");

      const currentStock = stockCheckResult.recordset[0]?.stock || 0;
      const productTitle =
        stockCheckResult.recordset[0]?.title || "Bilinmeyen Ürün";

      if (currentStock < item.quantity) {
        // rollback amacı -> transaction'da bir sorun varsa, tüm işlemleri geri al
        await transaction.rollback();
        return res.status(400).json({
          message: `Ürün stoğu yetersiz. Lütfen "${productTitle}" ürününün stok miktarını kontrol edin.`,
        });
      }
    }

    // 1. Toplam tutar hesapla
    const totalAmount = cart_items.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);

    // 2. Fatura oluştur
    const billResult = await transaction
      .request()
      .input("customer_id", customer_id)
      .input("payment_method_id", payment_method_id)
      .input("total_amount", totalAmount)
      .input("status", "pending")
      .query(
        "INSERT INTO bills (customer_id, payment_method_id, total_amount, status, created_at, updated_at) OUTPUT INSERTED.id VALUES (@customer_id, @payment_method_id, @total_amount, @status, SYSDATETIME(), SYSDATETIME())"
      );

    const billId = billResult.recordset[0].id;

    // 3. Fatura kalemlerini ekle ve ürün stoklarını güncelle
    for (const item of cart_items) {
      // fatura kalemlerini ekle
      await transaction
        .request()
        .input("bill_id", billId)
        .input("product_id", item.product_id)
        .input("quantity", item.quantity)
        .input("unit_price", item.unit_price)
        .query(
          "INSERT INTO bill_items (bill_id, product_id, quantity, unit_price) VALUES (@bill_id, @product_id, @quantity, @unit_price)"
        );

      // ürün stoğunu düşür
      await transaction
        .request()
        .input("product_id", item.product_id)
        .input("quantity", item.quantity)
        .query(
          `UPDATE products SET stock = stock - @quantity WHERE id = @product_id`
        );
    }

    // Eğer ödeme yöntemi nakit(1), kredi kartı(2) veya havale(4) ise ödeme kaydı ekle
    if ([1, 2, 4].includes(payment_method_id)) {
      await transaction
        .request()
        .input("bill_id", billId)
        .input("amount", totalAmount)
        .input("payment_method_id", payment_method_id)
        .input("payment_date", new Date())
        .query(
          `INSERT INTO bill_payments (bill_id, amount, payment_method_id, payment_date)
           VALUES (@bill_id, @amount, @payment_method_id, @payment_date)`
        );

      // faturayı paid yap
      await transaction
        .request()
        .input("id", billId)
        .query("UPDATE bills SET status = 'paid' WHERE id = @id");
    }

    // 4. transaction commit
    // amacı -> tüm işlemler başarılıysa, veritabanına kaydet.
    await transaction.commit();

    // 5. fatura bilgilerini döndür
    const detailResult = await pool.request().input("id", billId).query(`
            SELECT b.id, b.total_amount, c.name + ' ' + c.surname AS customer_name_surname, 
            pm.name AS payment_method FROM bills b 
            JOIN customers c ON b.customer_id = c.id 
            JOIN payment_methods pm ON b.payment_method_id = pm.id 
            WHERE b.id = @id
        `);

    const bill = detailResult.recordset[0];

    // 6. fatura kalemlerini ekle
    const itemsResult = await pool.request().input("bill_id", billId).query(`
    SELECT 
      p.*,
      bi.quantity,
      bi.unit_price,
      bi.quantity * bi.unit_price AS total_price
    FROM bill_items bi
    JOIN products p ON bi.product_id = p.id
    WHERE bi.bill_id = @bill_id
`);

    bill.cart_items = itemsResult.recordset;

    const paymentsResult = await pool.request().input("bill_id", billId).query(`
        SELECT bp.id, bp.amount, bp.payment_date, pm.name AS payment_method
        FROM bill_payments bp
        JOIN payment_methods pm ON bp.payment_method_id = pm.id
        WHERE bp.bill_id = @bill_id
      `);

    bill.payments = paymentsResult.recordset;
    bill.total_paid = paymentsResult.recordset.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    res.status(201).json(bill);
  } catch (error) {
    console.log("Fatura oluşturma hatası: ", error);

    // transaction rollback
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: "Fatura oluşturma hatası!" });
  }
};

// PUT /bills/:id -> Update a bill by ID
export const updateBill = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkiniz yok!" });
  }

  const billId = req.params.id;
  const { payments } = req.body;

  if (!billId || !payments || !Array.isArray(payments)) {
    return res.status(400).json({ message: "Geçersiz veri gönderildi" });
  }

  try {
    const pool = await poolPromise;

    // 1. faturayı kontrol et.
    const billResult = await pool
      .request()
      .input("id", billId)
      .query("SELECT * FROM bills WHERE id = @id");

    const bill = billResult.recordset[0];
    if (!bill) {
      return res.status(404).json({ message: "Fatura bulunamadı" });
    }

    // 2. Yeni ödemeleri ekle
    for (const p of payments) {
      await pool
        .request()
        .input("bill_id", billId)
        .input("amount", p.amount)
        .input("payment_method_id", p.payment_method_id)
        .input("payment_date", p.date).query(`
          INSERT INTO bill_payments (bill_id, amount, payment_method_id, payment_date)
          VALUES (@bill_id, @amount, @payment_method_id, @payment_date)
        `);
    }

    // 3. Toplam ödenen miktarı hesapla
    const paymentsResult = await pool.request().input("bill_id", billId).query(`
        SELECT SUM(amount) AS total_paid
        FROM bill_payments
        WHERE bill_id = @bill_id
      `);

    const totalPaid = paymentsResult.recordset[0].total_paid || 0;

    let newStatus = "pending";

    if (totalPaid === bill.total_amount) {
      newStatus = "paid";
    } else if (totalPaid > 0 && totalPaid < bill.total_amount) {
      newStatus = "partial";
    }

    await pool
      .request()
      .input("id", billId)
      .input("status", newStatus)
      .query(
        "UPDATE bills SET status = @status, updated_at = GETDATE() WHERE id = @id"
      );

    res.status(200).json({
      message: "Fatura güncellendi",
      totalPaid,
      status: newStatus,
    });
  } catch (error) {
    console.log("Fatura güncelleme hatası: ", error);
    res.status(500).json({ message: "Fatura güncelleme hatası!" });
  }
};

// DELETE /bills/:id -> Delete a bill by ID
export const deleteBill = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
  }

  const billId = req.params.id;

  if (!billId) {
    return res.status(400).json({ message: "Geçersiz fatura ID'si" });
  }

  try {
    const pool = await poolPromise;

    // 1. Fatura kalemlerini sil
    await pool
      .request()
      .input("bill_id", billId)
      .query("DELETE FROM bill_items WHERE bill_id = @bill_id");

    // 2. Faturayı sil
    await pool
      .request()
      .input("id", billId)
      .query("DELETE FROM bills WHERE id = @id");

    res.status(200).json({ message: "Fatura başarıyla silindi" });
  } catch (error) {
    console.log("Fatura silme hatası: ", error);
    res.status(500).json({ message: "Fatura silme hatası!" });
  }
};

// GET /bills/report/products -> Get product report
export const getProductReport = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkiniz yok!" });
  }

  try {
    const pool = await poolPromise;

    // 1. Ürün raporunu al
    const query = `
      SELECT 
        bi.product_id,
        p.title,
        SUM(bi.quantity) AS total_sold
      FROM bill_items bi
      JOIN products p ON bi.product_id = p.id
      GROUP BY bi.product_id, p.title
      ORDER BY total_sold DESC
    `;

    const result = await pool.request().query(query);
    const productReport = result.recordset;

    res.status(200).json(productReport);
  } catch (error) {
    console.log("Ürün raporu alırken hata: ", error);
    return res.status(500).json({ message: "Ürün raporu alırken hata!" });
  }
};

// Send Bill to customers email
export const sendBillEmail = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkiniz yok!" });
  }

  const billId = req.params.id;

  if (!billId) {
    return res.status(400).json({ message: "Geçersiz fatura ID'si" });
  }

  try {
    const pool = await poolPromise;

    // 1. Fatura bilgilerini al
    const billResult = await pool.request().input("id", billId).query(`
      SELECT b.id, b.total_amount, b.payment_method_id, c.name AS customer_name, c.email AS customer_email, pm.name AS payment_method_name 
      FROM bills b
      JOIN payment_methods pm ON b.payment_method_id = pm.id
      JOIN customers c ON b.customer_id = c.id
      WHERE b.id = @id
    `);

    const bill = billResult.recordset[0];

    if (!bill) {
      return res.status(404).json({ message: "Fatura bulunamadı" });
    }

    // 2. Fatura kalemlerini al
    const itemsResult = await pool.request().input("bill_id", billId).query(`
        SELECT 
          p.title, 
          bi.quantity, 
          bi.unit_price, 
          bi.quantity * bi.unit_price AS total_price 
        FROM bill_items bi 
        JOIN products p ON bi.product_id = p.id
        WHERE bi.bill_id = @bill_id
    `);

    const items = itemsResult.recordset;

    // 3. HTML template oluştur
    let itemsHtml = "";
    items.forEach((item) => {
      itemsHtml += `<tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
            item.quantity
          }</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.unit_price.toFixed(
            2
          )} TL</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.total_price.toFixed(
            2
          )} TL</td>
        </tr>`;
    });

    const htmlTemplate = `
      <h2>Meremin Soft POS - Fatura #${bill.id}</h2>
      <p>Sayın ${bill.customer_name},</p>
      <p>Faturanızın detayları aşağıda belirtilmiştir:</p>

      <p><strong>Ödeme Yöntemi:</strong> ${bill.payment_method_name}</p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ürün</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Adet</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Birim Fiyat</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Toplam Fiyat</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Genel Toplam:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${bill.total_amount.toFixed(
              2
            )} TL</strong></td>
          </tr>
        </tbody>
      </table>
      <p>İyi günler dileriz.</p>
      <p>Meremin Soft POS Ekibi</p>
      <p style="color:red; font-size:12px; margin-top:10px;">Bu fatura bilgilendirme amaçlıdır, resmi belge olarak kullanılamaz.</p>
    `;

    // 4. E-posta gönder
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "emre.ucarr1@gmail.com",
        pass: "avjr dilf cppo cykm",
      },
    });

    const mailOptions = {
      from: "emre.ucarr1@gmail.com",
      to: [bill.customer_email, "emre.ucarr1@gmail.com"],
      subject: `Fatura #${bill.id} - Mere POS`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Fatura e-postası başarıyla gönderildi" });
  } catch (error) {
    console.log("Fatura e-postası gönderme hatası: ", error);
    return res
      .status(500)
      .json({ message: "Fatura e-postası gönderme hatası!" });
  }
};
