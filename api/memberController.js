import {pool} from './connect.js';

var user = 'janlevinson'

// NOTE: Before testing, make sure to edit user credentials in connect.js (temporary measure)

// view the member's own info
// FIELDS
//   "student_number": "2019-04339",
//   "member_username": "janlevinson",
//   "member_password": "jl123",
//   "member_name": "Jan Levinson",
//   "gender": "F",
//   "degree_program": "BS Statistics"
const memberInfo = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM member_" + user);
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
  `SELECT * FROM feepays_${user}`

  const [rows] = await pool.query(query);
  res.send(rows);
}

// TO DO: view the member's organizations

// TO DO: View a member’s unpaid membership fees or dues for all their organizations 

export {memberInfo, memberTransactions}