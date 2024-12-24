const mysql = require("mysql2");

// Cấu hình kết nối từ biến môi trường
const pool = mysql.createPool({
  host:
<<<<<<< HEAD
    process.env.DB_HOST || "web-data.cliswaayk6ed.us-east-1.rds.amazonaws.com",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "Trung17062003",
=======
    process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "01012004",
>>>>>>> df3cdaf (Cập nhật editor,admin, writer)
  database: process.env.DB_NAME || "web_data",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  load: function (sql) {
    return new Promise(function (resolve, reject) {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  },
  add: function (table, entity) {
    return new Promise(function (resolve, reject) {
      const sql = `insert into ${table} set ?`;
      pool.query(sql, entity, function (error, results) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  },
  patch: function (table, entity, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `update ${table} set ? where ?`;
      pool.query(sql, [entity, condition], function (error, results) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  },
  del: function (table, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `delete from ${table} where ?`;
      pool.query(sql, condition, function (error, results) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  },
};

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL on AWS RDS!");
    connection.release(); // Trả lại kết nối vào pool
  }
});
