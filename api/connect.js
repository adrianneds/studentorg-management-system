import mysql from 'mysql2/promise';

// CHANGE WITH OWN PASSWORD
var pass = 'Jcbv@11-14-02'

// db connection
const pool = mysql.createPool({
  host: "localhost",
  user: 'root',
  password: pass,
  port: 3306,
  database: "studentorg"
});

export {pool};