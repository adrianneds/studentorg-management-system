import mysql from 'mysql2/promise';

// SAMPLE USER CREDENTIALS
var user = 'janlevinson'
var pass = 'jl123'

// db connection
try {
const pool = mysql.createPool({
  host: "localhost",
  user: user,
  password: pass,
  port: 3306,
  database: "studentorg"
});
} catch (err) {
  console.log("Invalid credentials");
}

export {pool, user, pass};