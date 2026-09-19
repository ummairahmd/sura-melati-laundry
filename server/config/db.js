const mysql = require("mysql2");
const cron = require("node-cron");

console.log("========== RENDER DB CONFIG ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_PASSWORD EXISTS:", !!process.env.DB_PASSWORD);
console.log("======================================");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "suramelati_laundry",
    port: process.env.DB_PORT || 10707,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
    console.log("========== DATABASE CONNECTION TEST ==========");

    if (err) {
        console.error("DATABASE CONNECTION ERROR:", err);
        return;
    }

    console.log("DATABASE CONNECTED SUCCESSFULLY");
    console.log("CONNECTED HOST:", process.env.DB_HOST);
    console.log("CONNECTED PORT:", process.env.DB_PORT);

    connection.release();
});

// Auto delete complaints older than 30 days
cron.schedule("0 0 * * *", () => {

    const sql = `
        DELETE FROM complaints
        WHERE created_at < NOW() - INTERVAL 30 DAY
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("AUTO DELETE COMPLAINT ERROR:", err);
            return;
        }

        console.log(
            `AUTO DELETE: ${result.affectedRows} old complaint(s) deleted.`
        );

    });

});

module.exports = db;
