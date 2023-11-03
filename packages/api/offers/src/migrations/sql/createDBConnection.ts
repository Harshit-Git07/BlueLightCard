import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '.env',
    debug: true,
})

const host = process.env.DB_HOST
const port = parseInt(process.env.DB_PORT ?? '3306')
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DATABASE

let connection: mysql.Connection;

const createDBConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database,
        })
    }

    return connection;
}

export default createDBConnection;