const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const env = process.env;

const port = 3508;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_kazuo_ikeda", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "db_kazuo_ikeda", // PostgreSQLのデータベース名に置き換えてください
  password: "pass", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//customer情報の検索処理
app.get("/customer", async (req, res) => {
  try {
    // クエリパラメータの取得
    const { companyName } = req.query;
    const customerData = await pool.query("SELECT * FROM customers WHERE company_name = $1", [companyName]);
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/customer-id", async (req, res) => {
  try {
    // クエリパラメータの取得
    const { customerId } = req.query;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [customerId]);
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.delete("/delete-customer", async (req, res) => {
  try {
    // クエリパラメータの取得
    const { companyName } = req.query;
    const customerData = await pool.query("DELETE FROM customers WHERE company_name = $1", [companyName]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.patch("/update-customer", async (req, res) => {
  try {
    // クエリパラメータの取得
    const { companyName, industry, contact, location, customerId } = req.body;
    const customerData = await pool.query("UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = CURRENT_TIMESTAMP WHERE customer_id = $5;", [companyName, industry, contact, location, customerId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.static("public"));
