import { mssql, poolPromise } from "../lib/db.js";

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

    // 4. her faturaya ait item'leri eşleştir
    const billsWithItems = bills.map((bill) => {
      return {
        ...bill,
        cart_items: allItems.filter((item) => item.bill_id === bill.id),
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

  try {
    const pool = await poolPromise;
    // transaction amacı -> Tüm işlemlerin otomatik olarak ya hepsinin başarılı olması ya da hepsinin geri alınması
    // örnek -> fatura kalemlerini eklerken bir sorun çıkarsa, faturayı ve kalemlerini geri al
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();

    // *** TÜM STOĞU KONTROL ET ***
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
    const billResult = await pool
      .request()
      .input("customer_id", customer_id)
      .input("payment_method_id", payment_method_id)
      .input("total_amount", totalAmount)
      .query(
        "INSERT INTO bills (customer_id, payment_method_id, total_amount, created_at, updated_at) OUTPUT INSERTED.id VALUES (@customer_id, @payment_method_id, @total_amount, SYSDATETIME(), SYSDATETIME())"
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

    res.status(201).json(bill);
  } catch (error) {
    console.log("Fatura oluşturma hatası: ", error);

    // transaction rollback
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: "Fatura oluşturma hatası!" });
  }
};

// PUT /bills/:id -> Update a bill by ID
export const updateBill = async (req, res) => {};

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
