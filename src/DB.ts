import mysql, {Connection} from 'mysql'

export class DB {

    static connect(): Connection {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'express_ts'
        })
    }
}