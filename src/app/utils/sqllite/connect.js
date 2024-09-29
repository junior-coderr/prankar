import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function connectToDatabase() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
  return db;
}

async function createTable() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await connectToDatabase();
      await db.exec(
        "CREATE TABLE IF NOT EXISTS callStatus (sid TEXT PRIMARY KEY, status TEXT, recordingUrl TEXT)"
      );
      resolve(db);
    } catch (error) {
      console.error("Failed to create table", error);
      reject(error);
    }
  });
}

async function connectToDatabase2() {
  const db = await open({
    filename: "./database_userPay.sqlite",
    driver: sqlite3.Database,
  });
  return db;
}

async function createUserTable() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await connectToDatabase2();
      await db.exec(
        "CREATE TABLE IF NOT EXISTS paymentStatus (email TEXT PRIMARY KEY, status TEXT)"
      );
      resolve(db);
    } catch (error) {
      console.error("Failed to create table", error);
      reject(error);
    }
  });
}
export { createUserTable };
export default createTable;
