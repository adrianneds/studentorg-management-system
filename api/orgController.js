import {pool} from './connect.js';

// CHECKED 5/27
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

// CHECKED 5/27
// View organization's own info
const orgInfo = async (req, res) => {
    var organization_id = req.params.user;
    var query = `SELECT * FROM organization WHERE organization_id = '${organization_id}';`
    const [rows] = await pool.query(query);
    res.send(rows)
};

// View members of an organization (with filtering)
const orgMembers = async (req, res) => {

    var organization_id = req.params.user

    let student_number = req.body.student_number;
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
        FROM is_part_of NATURAL JOIN organization WHERE organization_id = '${organization_id}'
        GROUP BY is_part_of.student_number) AS a
    JOIN is_part_of AS b 
    ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
    JOIN member AS c
    ON (b.student_number = c.student_number)`

    var whereClause = "";

    if (student_number !== "") {
        whereClause += ` WHERE c.student_number = '${student_number}'`
    }
    if (committee !== "") {
        whereClause += ` AND committee = '${committee}'`
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

// CHECKED 5/27
// View members with unpaid fees for a given semester/AY
const orgUnpaidMembers = async (req, res) => {

    let organization_id = req.params.user;
    
    let semester = req.query.sem;                  // need to pass to query
    let academic_year = req.query.ay;            

    const query =
    `SELECT student_number, member_name, transaction_id, fee_id, fee_name, fee_amount, payment_status,
    semester_issued, academic_year_issued
    FROM member NATURAL JOIN pays NATURAL JOIN fee WHERE organization_id = '${organization_id}'
    AND semester_issued = '${semester}' AND academic_year_issued = '${academic_year}'
    AND payment_status = "Unpaid";`

    const [rows] = await pool.query(query);
    res.send(rows)
};


// CHECKED 5/27
// REVISED 5/25 
//View total members and total active members
const orgMemberCounts = async (req, res) => {

    let organization_id = req.params.user;

    const query = 
    `SELECT 
    COUNT(DISTINCT student_number) AS count_total,
    SUM(CASE WHEN membership_status = 'Active' THEN 1 ELSE 0 END) AS count_active
    FROM member NATURAL JOIN organization NATURAL JOIN is_part_of 
        WHERE CONCAT(student_number, date_of_status_update, organization_id) IN
        (SELECT CONCAT(student_number, MAX(date_of_status_update), organization_id)
        FROM member NATURAL JOIN organization NATURAL JOIN is_part_of
        WHERE organization_id='${organization_id}'
        GROUP BY student_number);`

    try {
        const [rows] = await pool.query(query);
        res.send(rows)
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching member counts" });
      }
}

// REVISED 5/27
// View members of a specific committee given an AY
const orgCommitteeMembers = async (req, res) => {

    let organization_id = req.params.user;

    let committee = req.query.committee;
    let academic_year = req.query.ay;

    var query =`SELECT DISTINCT student_number, member_name, committee, role, academic_year, semester
    FROM is_part_of NATURAL JOIN member
    WHERE organization_id = '${organization_id}'
    AND academic_year = '${academic_year}'`

    if (committee != "") {
        query += ` AND committee = '${committee}'`
    }

    query += ";"

    const [rows] = await pool.query(query);
    res.send(rows)
}

// REVISED 5/27
// View roles
const orgRoles = async (req, res) => {

    let organization_id = req.params.user;
    let role = req.query.role;

    var query = `SELECT DISTINCT student_number, member_name, role, academic_year,
    committee, semester
    FROM is_part_of NATURAL JOIN member
    WHERE organization_id = '${organization_id}'`

    if (role !== "") {
        query += ` AND role = '${role}'`
    }

    query += ` ORDER BY academic_year DESC;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View status distribution for the last n semesters
const orgCountStatus = async (req, res) => {

    let organization_id = req.params.user;

    let n = req.query.n;

    const query = 
    `SELECT
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other,
    b.semester, b.academic_year
    FROM 
        (SELECT * FROM is_part_of NATURAL JOIN organization WHERE organization_id = '${organization_id}'
        GROUP BY student_number, semester, academic_year) AS b 
    GROUP BY b.academic_year, b.semester      
    ORDER BY b.academic_year DESC, b.semester DESC LIMIT ${n};`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View alumni
// TEST: http://localhost:5000/organization/alumni/user/MS-101123?date=2024-07-20
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "gender": "F",
//     "degree_program": "BS Statistics",
//     "date_of_status_update": "2024-06-30T16:00:00.000Z",
//     "membership_status": "Alumni"

const orgAlumni = async (req, res) => {

    let organization_id = req.params.user;
    let alumni_date = req.query.date;

    const query = 
    `SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status, batch
    FROM member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND membership_status = "Alumni"
    AND date_of_status_update <= '${alumni_date}';`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View total paid/unpaid fees
// TEST: http://localhost:5000/organization/feeStatus/user/MS-101123?date=2024-01-01
// FIELDS
//      "unpaid": 200,
//      "paid": 90
const orgFeeStatus = async (req, res) => {

    let organization_id = req.params.user;
    let fee_date = req.query.date;

    const query = 
    `SELECT 
    (SELECT SUM(fee_amount) as total_unpaid  
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = "Unpaid"
    AND issue_date <= '${fee_date}') AS unpaid,

    (SELECT SUM(fee_amount) as total_paid         
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = "Paid"
    AND payment_date <= '${fee_date}') AS paid`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// Member with highest debt
// TEST: http://localhost:5000/organization/highestDebt/user/MS-101123?ay=2024-2025&sem=1S
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "debt": 600
const orgHighestDebt = async (req, res) => {

    let organization_id = req.params.user;

    let academic_year_debt = req.query.ay;
    let semester_debt = req.query.sem;

    const query = 
    `
    SELECT * FROM
    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = 'Unpaid'
    AND CONCAT(academic_year_issued,semester_issued) <= CONCAT ('${academic_year_debt}', '${semester_debt}')
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// Late payments
// FIELDS
//     "student_number": "2022-04382",
//     "member_name": "Pam Beesly",
//     "fee_id": "FE-101193",
//     "due_date": "2024-11-18T16:00:00.000Z",
//     "payment_date": "2025-04-18T16:00:00.000Z",
//     "payment_status": "Paid"
const orgLatePayments = async (req, res) => {

    let organization_id = req.params.user;

    let academic_year = req.query.ay;
    let semester = req.query.sem;

    const query = 
    `SELECT student_number, member_name, transaction_id, fee_name, fee_amount,
    semester_issued, academic_year_issued, fee_id, due_date, payment_date, payment_status,
    semester, academic_year
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND semester = '${semester}' AND academic_year = '${academic_year}'
    AND payment_status = "Paid" AND payment_date > due_date;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// REVISED 5/25
// Add a fee
const addFee = async (req, res) => {

    let fee_id = req.body.fee_id;
    let fee_name = req.body.fee_name;
    let fee_amount = req.body.fee_amount;
    let issue_date = req.body.issue_date;
    let semester_issued = req.body.semester_issued;
    let academic_year_issued = req.body.academic_year_issued;
    let due_date = req.body.due_date;
    let organization_id = req.body.organization_id;

    const query =
    `INSERT INTO fee (fee_id, fee_name, fee_amount,  issue_date, semester_issued,
    academic_year_issued, due_date, organization_id)
    VALUES 
    ('${fee_id}', '${fee_name}', '${fee_amount}', '${issue_date}',
    '${semester_issued}', '${academic_year_issued}','${due_date}','${organization_id}');`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully added fee"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error adding fee"})
    }
}

// Delete a fee
const deleteFee = async (req, res) => {

    let fee_id = req.body.fee_id;
    const pays_query = `DELETE FROM pays WHERE fee_id = '${fee_id}';`
    const query = `DELETE FROM fee WHERE fee_id = '${fee_id}';`

    try {
        console.log(query)
        await pool.query(pays_query)
        await pool.query(query);
        res.status(200).json({message: "Successfully deleted fee"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error deleting fee"})
    }
}

// REVISED 5/25/2025
// Add transaction
const addPays = async (req, res) => {

    let student_number = req.body.student_number;
    let fee_id = req.body.fee_id;
    let payment_date = req.body.payment_date;
    let payment_status = req.body.payment_status;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;

    const query = 
    `INSERT INTO pays (student_number, fee_id, payment_date, payment_status, semester, academic_year)
    VALUES 
    ('${student_number}', '${fee_id}','${payment_date}', '${payment_status}', '${semester}', '${academic_year}');`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully added transaction"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error adding transaction"})
    }

}

// Update a transaction
const updateTransaction = async (req, res) => {

    let transaction_id = req.body.transaction_id;
    let student_number = req.body.student_number;
    let fee_id = req.body.fee_id;
    let payment_date = req.body.payment_date;
    let payment_status = req.body.payment_status;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;

    var query = `UPDATE pays SET `;

    var updateColumnsStr = '';
    var updateColumns = [];

    if (student_number !==""&&student_number!==undefined) {
        updateColumns.push(` student_number = '${student_number}'`)
    } 
    if (fee_id !=="" && fee_id!==undefined) {
        updateColumns.push(` fee_id = '${fee_id}'`)
    }
    if (payment_date !==""&&payment_date!==undefined) {
        updateColumns.push(` payment_date = '${payment_date}'`)
    } 
    if (payment_status !== ""&&payment_status!==undefined) {
        updateColumns.push(` payment_status = '${payment_status}'`)
    }
    if (semester !== ""&&semester!==undefined) {
        updateColumns.push(` semester = '${semester}'`)
    } 
    if (academic_year !== ""&&academic_year!==undefined) {
        updateColumns.push(` academic_year = ${academic_year}`)
    }

    updateColumnsStr = updateColumns.join()

    console.log(updateColumns)
    console.log(updateColumnsStr)

    if (updateColumnsStr[0]==',') {
        query = query + updateColumnsStr.slice(1,updateColumnsStr.length)
    } else {
        query = query + updateColumnsStr
    }

    query += ` WHERE transaction_id = '${transaction_id}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully updated transaction"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error updating transaction"})
    }

}

// Delete transaction
const deletePays = async (req, res) => {

    let transaction_id = req.body.transaction_id;

    const query = 
    `DELETE FROM pays WHERE transaction_id = '${transaction_id}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully deleted transaction"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error deleting transaction"})
    }

}

// Add status update
const addStatusUpdate = async (req, res) => {

    let student_number = req.body.student_number;
    let organization_id = req.body.organization_id;
    let committee = req.body.committee;
    let batch = req.body.batch;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;
    let date_of_status_update = req.body.date_of_status_update;
    let role = req.body.role;
    let membership_status = req.body.membership_status;

    const query = 
    `INSERT INTO is_part_of 
    (student_number, organization_id, committee, batch, semester, academic_year,
    date_of_status_update, role, membership_status)
    VALUES ('${student_number}', '${organization_id}', '${committee}', '${batch}', '${semester}', '${academic_year}',
    '${date_of_status_update}', '${role}', '${membership_status}');`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully added status update"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error adding status update"})
    }

}

// Update a status update
const updateStatusUpdate = async (req, res) => {

    let student_number = req.body.student_number;
    let organization_id = req.body.organization_id;
    let committee = req.body.committee;
    let batch = req.body.batch;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;
    let date_of_status_update = req.body.date_of_status_update;
    let role = req.body.role;
    let membership_status = req.body.membership_status;

    var query = `UPDATE is_part_of SET `;

    var updateColumnsStr = '';
    var updateColumns = [];

    if (committee !==""&&committee!==undefined) {
        updateColumns.push(` committee = '${committee}'`)
    } 
    if (batch !== ""&&batch!==undefined) {
        updateColumns.push(` batch = '${batch}'`)
    }
    if (date_of_status_update !== ""&&date_of_status_update!==undefined) {
        updateColumns.push(` date_of_status_update = '${date_of_status_update}'`)
    }
    if (role !== ""&&role!==undefined) {
        updateColumns.push(` role = '${role}'`)
    }
    if (membership_status !== ""&&membership_status!==undefined) {
        updateColumns.push(` membership_status = '${membership_status}'`)
    }

    updateColumnsStr = updateColumns.join()

    console.log(updateColumns)
    console.log(updateColumnsStr)

    if (updateColumnsStr[0]==',') {
        query = query + updateColumnsStr.slice(1,updateColumnsStr.length)
    } else {
        query = query + updateColumnsStr
    }

    query += ` WHERE student_number = '${student_number}' AND organization_id = '${organization_id}'
                AND semester = '${semester}' AND academic_year = '${academic_year}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully updated status update"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error updating status update"})
    }

}

// REVISED 5/25/2025
// Delete a status update
const deleteStatusUpdate = async (req, res) => {

    let semester = req.body.semester;
    let academic_year = req.body.academic_year;
    let student_number = req.body.student_number;
    let organization_id = req.body.organization_id;

    const query = 
    `DELETE FROM is_part_of 
    WHERE semester = '${semester}'
    AND academic_year = '${academic_year}' AND student_number = '${student_number}'
    AND organization_id = '${organization_id}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully deleted status update"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error deleting status update"})
    }
}

// REVISED 5/25/2025
// Update a fee
const updateFee = async (req, res) => {

    let fee_id = req.body.fee_id;
    let fee_name = req.body.fee_name;
    let fee_amount = req.body.fee_amount;
    let due_date = req.body.due_date;
    let issue_date = req.body.issue_date;
    let semester_issued = req.body.semester_issued;
    let academic_year_issued = req.body.academic_year_issued;

    console.log(fee_name)

    var query = `UPDATE fee SET `;

    var updateColumnsStr = '';
    var updateColumns = [];

    if (fee_name !==""&&fee_name!==undefined) {
        updateColumns.push(` fee_name = '${fee_name}'`)
    } 
    if (fee_amount !=='' && fee_amount!==undefined && fee_amount!=null) {
        updateColumns.push(` fee_amount = '${fee_amount}'`)
    }
    if (due_date !==""&&due_date!==undefined) {
        updateColumns.push(` due_date = '${due_date}'`)
    } 
    if (issue_date !== ""&&issue_date!==undefined) {
        updateColumns.push(` issue_date = '${issue_date}'`)
    }
    if (semester_issued !== ""&&semester_issued!==undefined) {
        updateColumns.push(` semester_issued = '${semester_issued}'`)
    } 
    if (academic_year_issued !== ""&&academic_year_issued!==undefined) {
        updateColumns.push(` academic_year_issued = '${academic_year_issued}'`)
    }

    updateColumnsStr = updateColumns.join()

    console.log(updateColumns)
    console.log(updateColumnsStr)

    if (updateColumnsStr[0]==',') {
        query = query + updateColumnsStr.slice(1,updateColumnsStr.length)
    } else {
        query = query + updateColumnsStr
    }

    query += ` WHERE fee_id = '${fee_id}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully updated fee"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error updating fee"})
    }

}

// View all fees
const viewFees = async (req, res) => {

    let organization_id = req.params.user;
    const query = 
    `SELECT fee_id, fee_name, fee_amount, issue_date, semester_issued, academic_year_issued, due_date FROM fee 
    NATURAL JOIN organization WHERE organization_id = '${organization_id}';`

    try {
        const [rows] = await pool.query(query);
        res.send(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error retrieving fees"})
    }
}

// View all status updates
const viewStatusUpdates = async (req, res) => {

    let organization_id = req.params.user;
    const query = 
    `SELECT student_number, member_name, committee, batch, semester,
    academic_year, date_of_status_update, role, membership_status FROM 
    member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_id = '${organization_id}';`

    try {
        const [rows] = await pool.query(query);
        res.send(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error retrieving status updates"})
    }
}

// View all transactions
const viewTransactions = async (req, res) => {

    let organization_id = req.params.user;
    const query = 
    `SELECT transaction_id, student_number, member_name, fee_id, fee_amount, fee_name, issue_date, semester_issued,
    academic_year_issued, due_date, payment_date, payment_status, semester, academic_year
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization WHERE organization_id = '${organization_id}';`

    try {
        const [rows] = await pool.query(query);
        res.send(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error retrieving transactions"})
    }
}

const getOrganizationId = async (req, res) => {
    let username = req.params.user;
    const query = 
    `SELECT organization_id FROM organization WHERE organization_username = '${username}'`;
    try {
        const [rows] = await pool.query(query);
        res.send(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error retrieving id"})
    }
}

// DELETE FROM `member`;
// INSERT INTO member VALUES
//     ('2022-04382','pambeesly','pb123','Pam Beesly','F','BS Statistics'),
// 	('2022-12034','jimhalpert','jh456','Jim Halpert','M','BS Computer Science'),
// 	('2023-20302','erinhannon','ekh123','Erin Kelly Hannon','F','BS Economics'),
// 	('2021-20392','dwightschrute','ds456','Dwight Schrute','M','BS Math'),
// 	('2019-04339','janlevinson','jl123','Jan Levinson','F','BS Math'),
// 	('2020-93922','andybernard','ab456','Andy Bernard','M','BS Economics'),
// 	('2020-83492','kellykapoor','kk123','Kelly Kapoor','F','BS Economics')
// ;


// add member
const addMember = async (req, res) => {

    let student_number = req.body.student_number;
    let member_username = req.body.member_username;
    let member_password = req.body.member_password;   // NOTE: note sure if organization ba magseset nito????
    let member_name = req.body.member_name;
    let gender = req.body.gender;
    let degree_program = req.body.degree_program;

    let organization_id = req.body.organization_id;
    let committee = req.body.committee;
    let batch = req.body.batch;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;
    let date_of_status_update = req.body.date_of_status_update;
    let role = req.body.role;
    let membership_status = req.body.membership_status;

    const query = 
    `INSERT INTO member 
    (student_number, member_username, member_password, member_name, gender, degree_program)
    VALUES 
    ('${student_number}', '${member_username}', '${member_password}', '${member_name}', '${gender}', '${degree_program}');`

    const ispartof_query = 
    `INSERT INTO is_part_of 
    (student_number, organization_id, committee, batch, semester, academic_year,
    date_of_status_update, role, membership_status)
    VALUES 
    ('${student_number}', '${organization_id}', '${committee}', '${batch}', '${semester}',
    '${academic_year}', '${date_of_status_update}', '${role}', '${membership_status}');`

    try {
        console.log(query)
        await pool.query(query);
        await pool.query(ispartof_query)
        res.status(200).json({message: "Successfully added member"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error adding member"})
    }
}

// update member
const updateMember = async (req, res) => {

    let organization_id = req.body.organization_id;
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

    console.log(updateColumns)
    console.log(updateColumnsStr)

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

//delete member from the organization's records
const deleteMember = async (req, res) => {
    let student_number = req.body.student_number;
    let organization_id = req.body.organization_id;

    const pays_query = 
    `DELETE FROM pays WHERE student_number = '${student_number}' AND organization_id = '${organization_id}';`;

    const ispartof_query = 
    `DELETE FROM is_part_of WHERE student_number = '${student_number} AND organization_id = '${organization_id}';`;

    try {
        console.log(query)
        await pool.query(pays_query);
        await pool.query(ispartof_query);
        res.status(200).json({message: "Successfully deleted member"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error deleting member"})
    }
}

// add organization or register
const addOrganization = async (req, res) => {

    let organization_id = req.body.organization_id;
    let organization_username = req.body.organization_username;
    let organization_name = req.body.organization_name;
    let organization_password = req.body.organization_password;

    const query = 
    `INSERT INTO organization VALUES ('${organization_id}', '${organization_username}',
    '${organization_password}', '${organization_name}');`;

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully added organization"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error adding organization"})
    }
}

export {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
        orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt, orgLatePayments,
        orgMembers, logIn, addFee, deleteFee, addPays, deletePays, addStatusUpdate, deleteStatusUpdate,
        updateFee, viewFees, viewStatusUpdates, viewTransactions, orgMemberCounts, getOrganizationId,updateTransaction,
        updateStatusUpdate, addMember, updateMember, deleteMember, addOrganization}

