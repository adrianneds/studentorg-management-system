import mysql from 'mysql2/promise';

// SAMPLE USER CREDENTIALS

// sample member
// var user = 'janlevinson'
// var pass = 'jl123'

// sample user
var user = 'mathsoc'
var pass = 'msoc123'

// db connection
const pool = mysql.createPool({
  host: "localhost",
  user: user,
  password: pass,
  port: 3306,
  database: "studentorg"
});

export {pool, user, pass};