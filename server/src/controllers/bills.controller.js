import { poolPromise } from "../lib/db.js";

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
        bi.title,
        bi.quantity,
        bi.unit_price,
        bi.quantity * bi.unit_price AS total_price
      FROM bill_items bi
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
    return res.status(403).json({ message: "Yetkiniz yok!" });
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

    // 3. Fatura kalemlerini ekle
    const insertQueries = cart_items.map((item) => {
      return pool
        .request()
        .input("bill_id", billId)
        .input("product_id", item.product_id)
        .input("title", item.title)
        .input("quantity", item.quantity)
        .input("unit_price", item.unit_price)
        .query(
          "INSERT INTO bill_items (bill_id, product_id, title, quantity, unit_price) VALUES (@bill_id, @product_id, @title, @quantity, @unit_price)"
        );
    });

    await Promise.all(insertQueries);

    // 4. Fatura oluşturulduktan sonra, fatura bilgilerini döndür
    const detailResult = await pool.request().input("id", billId).query(`
            SELECT b.id, b.total_amount, c.name + ' ' + c.surname AS customer_name_surname, 
            pm.name AS payment_method FROM bills b 
            JOIN customers c ON b.customer_id = c.id 
            JOIN payment_methods pm ON b.payment_method_id = pm.id 
            WHERE b.id = @id
        `);

    const bill = detailResult.recordset[0];

    const itemsResult = await pool.request().input("bill_id", billId).query(`
                SELECT title, quantity, unit_price, quantity * unit_price AS total_price FROM bill_items WHERE bill_id = @bill_id
            `);

    bill.cart_items = itemsResult.recordset;

    res.status(201).json(bill);
  } catch (error) {
    console.log("Fatura oluşturma hatası: ", error);
    res.status(500).json({ message: "Fatura oluşturma hatası!" });
  }
};

// PUT /bills/:id -> Update a bill by ID
export const updateBill = async (req, res) => {};

// DELETE /bills/:id -> Delete a bill by ID
export const deleteBill = async (req, res) => {};
