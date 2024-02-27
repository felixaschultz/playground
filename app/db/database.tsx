import mysql from "mysql2/promise";
import { EventEmitter } from "events";

const con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

const eventEmitter = new EventEmitter();

export { con, eventEmitter };