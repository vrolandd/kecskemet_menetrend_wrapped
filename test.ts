import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '192.168.0.101',
    password: 'root',
    user: 'root',
    database: 'kecskemet_menetrend',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 120000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});


async function main() {
    console.log(await pool.query('SELECT * FROM kesesek WHERE jarat_id = 3393330'))
}

main()