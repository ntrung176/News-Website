const mysql = require("mysql2");

// Tạo pool kết nối sử dụng URI
const pool = mysql.createPool(
  process.env.DATABASE_URL ||
    "mysql://ugimgrju4cbafwyy:yXslDuAqaQLKYc6e0ppF@bvp6hrax9qy5ofayesnc-mysql.services.clever-cloud.com:3306/bvp6hrax9qy5ofayesnc"
);

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

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL using URI!");
    connection.release(); // Trả lại kết nối vào pool
  }
});
