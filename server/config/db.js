const mysql = require("mysql2");
const cron = require("node-cron");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "suramelati_laundry",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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