import {pool} from './connect.js';

// SAMPLE USER
// var user = 'mathsoc' //msoc123

// Login function
const SECRET_KEY ='secret'
const logIn = async (req, res) => {

  let username = req.body.username
  let password = req.body.password

  var query = 
  `SELECT organization_username, organization_password, organization_id FROM organization`
  const [rows] = await pool.query(query);

  try {
    let user = rows.find(o => o.organization_username === username && o.organization_password === password)
    console.log(user)
    if (!user) {
        res.status(401).json({message: "Invalid credentials"})
    }
    try {
      //const token = jwt.sign({userId: user.organization_id}, SECRET_KEY, {expiresIn: '1hr'})
      res.status(200).json({message: "Successful login"})
    } catch(err) {
      res.status(500).json({message: 'Error logging in ' + err})
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({message: "Invalid credentials " + err})
  }

};

// View organization's own info
// TEST     : http://localhost:5000/organization/info/user/mathsoc
// FIELDS   
//     "organization_id": "MS-101123",
//     "organization_username": "mathsoc",
//     "organization_password": "msoc123",
//     "organization_name": "Mathematics Society"
const orgInfo = async (req, res) => {
    var user = req.params.user;
    var query = `SELECT * FROM organization WHERE organization_username = '${user}';`
    const [rows] = await pool.query(query);
    res.send(rows)
};

// View members of an organization (with filtering)
// TEST:  node test.js
// FIELDS
//     student_number: '2022-04382',
//     member_name: 'Pam Beesly',
//     gender: 'F',
//     degree_program: 'BS Statistics',
//     recent_status_date: '2025-04-30T16:00:00.000Z',
//     membership_status: 'Active',
//     batch: '2022B',
//     committee: 'Executive',
//     role: 'President'
const orgMembers = async (req, res) => {

    var user = req.params.user

    let committee = req.body.committee
    let role = req.body.role
    let status = req.body.membership_status
    let gender = req.body.gender
    let degree_program = req.body.degree_program
    let batch = req.body.batch

    var query = 
    `SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
    b.membership_status, b.batch, b.committee, b.role
    FROM
        (SELECT student_number, MAX(date_of_status_update) as recent_status_date
        FROM is_part_of NATURAL JOIN organization WHERE organization_username = '${user}'
        GROUP BY is_part_of.student_number) AS a
    JOIN is_part_of AS b 
    ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
    JOIN member AS c
    ON (b.student_number = c.student_number)`

    var whereClause = "";

    if (committee !== "") {
        whereClause += ` WHERE committee = '${committee}'`
    }
    if (role !== "") {
        whereClause += ` AND role = '${role}'`
    } 
    if (status !== "") {
        whereClause += ` AND membership_status = '${status}'`
    } 
    if (gender !== "") {
        whereClause += ` AND gender = '${gender}'`
    }
    if (degree_program !== "") {
        whereClause += ` AND degree_program = '${degree_program}'`
    }
    if (batch !== "") {
        whereClause += ` AND batch = '${batch}'`
    }
    if (whereClause!=="") {
        if (whereClause[1]=='A') {
            whereClause = ' WHERE' + whereClause.slice(4, whereClause.length) + ';'
        }
    } else {
        query += ';'
    }

    query += whereClause;
    console.log(query)

    const [rows] = await pool.query(query);
    res.send(rows)
};

// TO DO: Add a fee

// TO DO: Update a fee amount

// TO DO: Update a fee name

// TO DO: Delete a fee

// TO DO: Add a transaction (pays)

// TO DO: Update a transaction status, payment date, sem, AY of payment

// TO DO: Delete a transaction

// TO DO: Add a status update

// View members with late payments for a given semester/AY
// TEST: http://localhost:5000/organization/unpaidMembers?sem=2S&ay=2023-2024
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "transaction_id": 1003,
//     "fee_id": "FE-193921",
//     "fee_name": "Miscellaneous A",
//     "fee_amount": 200,
//     "payment_status": "Unpaid",
//     "semester_issued": "2S",
//     "academic_year_issued": "2023-2024"
const orgUnpaidMembers = async (req, res) => {
    
    let semester = req.query.sem;                  // need to pass to query
    let academic_year = req.query.ay;            

    const query =
    `SELECT student_number, member_name, transaction_id, fee_id, fee_name, fee_amount, payment_status,
    semester_issued, academic_year_issued
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization WHERE organization_username = '${user}'
    AND semester_issued = '${semester}' AND academic_year_issued = '${academic_year}'
    AND payment_status = "Unpaid";`

    const [rows] = await pool.query(query);
    res.send(rows)
};

// View members of a specific committee given an AY
// TEST: http://localhost:5000/organization/committeeMembers?ay=2023-2024&committee=Executive
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "committee": "Executive",
//     "role": "Secretary",
//     "academic_year": "2023-2024"
const orgCommitteeMembers = async (req, res) => {

    let committee = req.query.committee;
    let academic_year = req.query.ay;

    const query = 
    `SELECT DISTINCT c.student_number, c.member_name, b.committee, b.role, b.academic_year
    FROM (organization NATURAL JOIN is_part_of AS b)
    JOIN member c ON b.student_number = c.student_number
    WHERE organization_username = '${user}'
    AND b.committee = '${committee}'
    AND b.academic_year = '${academic_year}';`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View roles
// TEST: http://localhost:5000/organization/roles?role=President&ay=2023-2024
// FIELDS
//     "student_number": "2022-04382",
//     "member_name": "Pam Beesly",
//     "role": "President",
//     "academic_year": "2024-2025"
const orgRoles = async (req, res) => {

    let role = req.query.role;
    let academic_year = req.query.ay;

    const query = 
    `SELECT DISTINCT c.student_number, c.member_name, b.role, b.academic_year
    FROM (organization NATURAL JOIN is_part_of AS b)
    JOIN member c ON b.student_number = c.student_number
    WHERE organization_username = '${user}'
    AND b.role = '${role}'
    ORDER BY b.academic_year DESC;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View status distribution for the last n semesters
// TEST: http://localhost:5000/organization/memberStatus?n=3
// FIELDS (per n sem entries)
//     "percent_active": "100.0000",
//     "percent_inactive": "0.0000",
//     "percent_other": "0.0000",
//     "semester": "1S",
//     "academic_year": "2024-2025"
const orgCountStatus = async (req, res) => {

    let n = req.query.n;

    const query = 
    `SELECT
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other,
    b.semester, b.academic_year
    FROM 
        (SELECT * FROM is_part_of NATURAL JOIN organization WHERE organization_username = '${user}'
        GROUP BY student_number, semester, academic_year) AS b 
    GROUP BY b.academic_year, b.semester      
    ORDER BY b.semester, b.academic_year DESC LIMIT ${n};`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View alumni
// TEST: http://localhost:5000/organization/alumni?date=2024-07-20
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "gender": "F",
//     "degree_program": "BS Statistics",
//     "date_of_status_update": "2024-06-30T16:00:00.000Z",
//     "membership_status": "Alumni"

const orgAlumni = async (req, res) => {

    let alumni_date = req.query.date;

    const query = 
    `SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status
    FROM member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND membership_status = "Alumni"
    AND date_of_status_update <= '${alumni_date}';`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View total paid/unpaid fees
// TEST: http://localhost:5000/organization/feeStatus?date=2024-01-01
// FIELDS
//      "unpaid": 200,
//      "paid": 90
const orgFeeStatus = async (req, res) => {

    let fee_date = req.query.date;

    const query = 
    `SELECT 
    (SELECT SUM(fee_amount) as total_unpaid  
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND payment_status = "Unpaid"
    AND issue_date <= '${fee_date}') AS unpaid,

    (SELECT SUM(fee_amount) as total_paid         
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND payment_status = "Paid"
    AND payment_date <= '${fee_date}') AS paid`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// Member with highest debt
// TEST: http://localhost:5000/organization/highestDebt?ay=2024-2025&sem=1S
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "debt": 600
const orgHighestDebt = async (req, res) => {

    let academic_year_debt = req.query.ay;
    let semester_debt = req.query.sem;

    const query = 
    `SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND payment_status = "Unpaid"
    AND CONCAT(academic_year_issued,semester_issued) <= CONCAT ('${academic_year_debt}', '${semester_debt}') 
    GROUP BY student_number
    ORDER BY debt DESC LIMIT 1;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// Late payments
// TEST: http://localhost:5000/organization/latePayments?sem=2S&ay=2023-2024
// FIELDS
//     "student_number": "2022-04382",
//     "member_name": "Pam Beesly",
//     "fee_id": "FE-101193",
//     "due_date": "2024-11-18T16:00:00.000Z",
//     "payment_date": "2025-04-18T16:00:00.000Z",
//     "payment_status": "Paid"
const orgLatePayments = async (req, res) => {

    let academic_year = req.query.ay;
    let semester = req.query.sem;

    const query = 
    `SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND semester = '${semester}' AND academic_year = '${academic_year}'
    AND payment_status = "Paid" AND payment_date > due_date;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

export {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
        orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt, orgLatePayments,
        orgMembers, logIn}

