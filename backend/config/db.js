const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'lifearchive',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();