import {pool} from './connect.js';
import jwt from 'jsonwebtoken';

// SAMPLE CREDENTIALS
// var user = 'janlevinson'
// var password = 'jl123'

// Login function
const SECRET_KEY ='secret'
const logIn = async (req, res) => {

  let username = req.body.username
  let password = req.body.password

  var query = 
  `SELECT member_username, member_password, student_number FROM member`
  const [rows] = await pool.query(query);

  try {
    let user = rows.find(o => o.member_username === username && o.member_password === password)
    try {
      const token = jwt.sign({userId: user.student_number}, SECRET_KEY, {expiresIn: '1hr'})
      res.status(200).json({message: "Successful login"})
    } catch(err) {
      res.status(500).json({message: 'Error logging in ' + err})
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({message: "Invalid credentials " + err})
  }

};

// view the member's own info
// FIELDS
//   "student_number": "2019-04339",
//   "member_username": "janlevinson",
//   "member_password": "jl123",
//   "member_name": "Jan Levinson",
//   "gender": "F",
//   "degree_program": "BS Statistics"
const memberInfo = async (req, res) => {
  const user = req.params.user;
  const [rows] = await pool.query(`SELECT * FROM member WHERE member_username = '${user}';`);
  res.send(rows)
};

// view the member's transactions
// FIELDS:
//   "organization_id": "MS-101123",
//   "organization_name": "Mathematics Society",
//   "fee_id": "FE-101193",
//   "fee_name": "Membership Fee",
//   "fee_amount": 90,
//   "student_number": "2019-04339",
//   "issue_date": "2022-04-30T16:00:00.000Z",
//   "semester_issued": "2S",
//   "academic_year_issued": "2021-2022",
//   "payment_date": "2022-05-31T16:00:00.000Z",
//   "payment_status": "Paid",
//   "semester": "2S",
//   "academic_year": "2021-2022"
const memberTransactions = async (req, res) => {

  const query = 
  `SELECT * FROM fee NATURAL JOIN pays NATURAL JOIN member WHERE member_username = '${user}';`

  const [rows] = await pool.query(query);
  res.send(rows);
}

// TO DO: view the member's organizations

// TO DO: View a member’s unpaid membership fees or dues for all their organizations 

export {memberInfo, memberTransactions, logIn}