const mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'xz',
    connectionLimit:20
});
module.exports = pool;