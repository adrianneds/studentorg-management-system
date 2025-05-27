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
  const student_number = req.params.user;
  const [rows] = await pool.query(`SELECT * FROM member WHERE student_number = '${student_number}';`);
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

  const student_number = req.query.student_number;
  const status = req.query.status;
  const organization_id = req.query.organization_id;

  var query = 
  `SELECT * FROM fee NATURAL JOIN pays NATURAL JOIN organization
  WHERE student_number = '${student_number}'`

  if (status != "" && status != undefined) {
    query += ` AND payment_status = '${status}'`
  } 
  if (organization_id !="" && organization_id != undefined) {
    query += ` AND organization_id = '${organization_id}'`
  }
  query += ';'

  console.log(query)

  const [rows] = await pool.query(query);
  console.log(rows)
  res.send(rows);
}

// Get student number
const getStudentNumber = async (req, res) => {
  const user = req.params.user;
  const query = 
  `SELECT student_number FROM member WHERE member_username = '${user}';`

  const [rows] = await pool.query(query);
  res.send(rows);
}

// view the member's organizations
const getOrganizations = async (req, res) => {
  const student_number = req.params.user;
  
  const query = 
  `SELECT DISTINCT organization_id, organization_name, batch, committee, role, membership_status, date_of_status_update
   FROM is_part_of NATURAL JOIN organization
   WHERE CONCAT(date_of_status_update, organization_id) IN
      (SELECT CONCAT(MAX(date_of_status_update), organization_id) as "recent_status_date"
      FROM is_part_of NATURAL JOIN organization WHERE student_number = '${student_number}'
      GROUP BY is_part_of.organization_id);`

  const [rows] = await pool.query(query);
  res.send(rows);
}


// View a member’s unpaid membership fees or dues for all their organizations 
const getMemberUnpaidFees = async (req, res) => {
  const student_number = req.params.user;

  const query = 
  `SELECT transaction_id, organization_id, organization_name, fee_id,
  fee_name, fee_amount, payment_status, due_date, semester_issued, academic_year_issued
  FROM fee NATURAL JOIN pays NATURAL JOIN organization
  WHERE student_number = '${student_number}' AND payment_status = "Unpaid";`

  const [rows] = await pool.query(query);
  res.send(rows);
}

// Update member info
const updateMember = async (req, res) => {

    let student_number = req.body.student_number;
    let member_username = req.body.member_username;
    let member_name = req.body.member_name;
    let gender = req.body.gender;
    let degree_program = req.body.degree_program;

    var query = `UPDATE member SET `;

    var updateColumnsStr = '';
    var updateColumns = [];

    if (member_username !=="" && member_username!==undefined) {
        updateColumns.push(` member_username = '${member_username}'`)
    }
    if (member_name !== ""&&member_name!==undefined) {
        updateColumns.push(` member_name = '${member_name}'`)
    }
    if (gender !== ""&&gender!==undefined) {
        updateColumns.push(` gender = '${gender}'`)
    } 
    if (degree_program !== ""&&degree_program!==undefined) {
        updateColumns.push(` degree_program = '${degree_program}'`)
    }

    updateColumnsStr = updateColumns.join()

    if (updateColumnsStr[0]==',') {
        query = query + updateColumnsStr.slice(1,updateColumnsStr.length)
    } else {
        query = query + updateColumnsStr
    }

    query += ` WHERE student_number = '${student_number}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully updated member"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error updating member"})
    }

}

// add member / register
const addMember = async (req, res) => {

  let student_number = req.body.student_number;
  let member_username = req.body.member_username;
  let member_password = req.body.member_password;   // NOTE: note sure if organization ba magseset nito????
  let member_name = req.body.member_name;
  let gender = req.body.gender;
  let degree_program = req.body.degree_program;

  const query =
  `INSERT INTO member VALUES ('${student_number}', '${member_username}', '${member_password}',
  '${member_name}', '${gender}', '${degree_program}');`

  try {
      console.log(query)
      await pool.query(query);
      res.status(200).json({message: "Successfully registeredd"})
  } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error in register"})
  }

}

export {memberInfo, memberTransactions, logIn, getStudentNumber, getOrganizations, getMemberUnpaidFees, updateMember, addMember}
