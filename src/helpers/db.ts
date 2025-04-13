import { DB_HOST, DB_NAME, DB_PASS, DB_USER_NAME } from "../../src/env";
import mysql, { PoolOptions } from "mysql2";
const dotenv = require("dotenv");
dotenv.config();
// const mysql = require("mysql2");
// like ENUM
const HttpStatusCodes: {
  [key: string]: string;
} = {
  "422": "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD",
  "409": "ER_DUP_ENTRY",
};
export class DBConnection {
  public db;
  constructor() {
    this.db = mysql.createPool({
      host: DB_HOST,
      user: DB_USER_NAME,
      password: DB_PASS,
      database: DB_NAME,
    });

    this.checkConnection();
  }

  private checkConnection() {
    // @ts-ignore
    this.db.getConnection((err, connection) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
          console.error("Database connection was refused.");
        }
      }
      if (connection) {
        connection.release();
      }
      return;
    });
  }

  public async query(sql: string, values: any) {
    return new Promise((resolve, reject) => {
      const callback = (error: any, result: any) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      };
      // execute will internally call prepare and query
      return this.db.execute(sql, values, callback);
    }).catch((err) => {
      const mysqlErrorList = Object.keys(HttpStatusCodes);
      // convert mysql errors which in the mysqlErrorList list to http status code
      err.status = mysqlErrorList.includes(err.code)
        ? HttpStatusCodes[err.code]
        : err.status;

      throw err;
    });
  }
}
export const dbConn = new DBConnection();
