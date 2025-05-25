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

// View members with unpaid fees for a given semester/AY
// TEST: http://localhost:5000/organization/unpaidMembers/user/mathsoc?sem=2S&ay=2023-2024
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

    let user = req.params.user;
    
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


// REVISED 5/25 
//View total members and total active members
const orgMemberCounts = async (req, res) => {

    let organization_username = req.params.organization_username;

    const query = 
    `SELECT 
    COUNT(DISTINCT student_number) AS count_total,
    SUM(CASE WHEN membership_status = 'Active' THEN 1 ELSE 0 END) AS count_active
    FROM member NATURAL JOIN organization NATURAL JOIN is_part_of 
        WHERE CONCAT(student_number, date_of_status_update, organization_id) IN
        (SELECT CONCAT(student_number, MAX(date_of_status_update), organization_id)
        FROM member NATURAL JOIN organization NATURAL JOIN is_part_of
        WHERE organization_username='${organization_username}'
        GROUP BY student_number);`

    try {
        const [rows] = await pool.query(query, [user]);
        res.status(200).json(rows[0]); 
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching member counts" });
      }

}

// View members of a specific committee given an AY
// TEST: http://localhost:5000/organization/committeeMembers/user/mathsoc?ay=2023-2024&committee=Executive
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "committee": "Executive",
//     "role": "Secretary",
//     "academic_year": "2023-2024"
const orgCommitteeMembers = async (req, res) => {

    let user = req.params.user;

    let committee = req.query.committee;
    let academic_year = req.query.ay;

    var query =`SELECT DISTINCT c.student_number, c.member_name, b.committee, b.role, b.academic_year, b.semester
    FROM (organization NATURAL JOIN is_part_of AS b)
    JOIN member c ON b.student_number = c.student_number
    WHERE organization_username = '${user}'
    AND b.academic_year = '${academic_year}'`

    if (committee != "") {
        query += ` AND b.committee = '${committee}'`
    }

    query += ";"

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View roles
// TEST: http://localhost:5000/organization/roles/user/mathsoc/?role=President
// FIELDS
//     "student_number": "2022-04382",
//     "member_name": "Pam Beesly",
//     "role": "President",
//     "academic_year": "2024-2025"
const orgRoles = async (req, res) => {

    let user = req.params.user;
    let role = req.query.role;

    var query = `SELECT DISTINCT c.student_number, c.member_name, b.role, b.academic_year,
    b.committee, b.semester
    FROM (organization NATURAL JOIN is_part_of AS b)
    JOIN member c ON b.student_number = c.student_number
    WHERE organization_username = '${user}'`

    if (role !== "") {
        query += ` AND b.role = '${role}'`
    }

    query += ` ORDER BY b.academic_year DESC;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View status distribution for the last n semesters
// TEST: http://localhost:5000/organization/memberStatus/user/mathsoc?n=3
// FIELDS (per n sem entries)
//     "percent_active": "100.0000",
//     "percent_inactive": "0.0000",
//     "percent_other": "0.0000",
//     "semester": "1S",
//     "academic_year": "2024-2025"
const orgCountStatus = async (req, res) => {

    let user = req.params.user;

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
// TEST: http://localhost:5000/organization/alumni/user/mathsoc?date=2024-07-20
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "gender": "F",
//     "degree_program": "BS Statistics",
//     "date_of_status_update": "2024-06-30T16:00:00.000Z",
//     "membership_status": "Alumni"

const orgAlumni = async (req, res) => {

    let user = req.params.user;
    let alumni_date = req.query.date;

    const query = 
    `SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status, batch
    FROM member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND membership_status = "Alumni"
    AND date_of_status_update <= '${alumni_date}';`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// View total paid/unpaid fees
// TEST: http://localhost:5000/organization/feeStatus/user/mathsoc?date=2024-01-01
// FIELDS
//      "unpaid": 200,
//      "paid": 90
const orgFeeStatus = async (req, res) => {

    let user = req.params.user;
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
// TEST: http://localhost:5000/organization/highestDebt/user/mathsoc?ay=2024-2025&sem=1S
// FIELDS
//     "student_number": "2019-04339",
//     "member_name": "Jan Levinson",
//     "debt": 600
const orgHighestDebt = async (req, res) => {

    let user = req.params.user;

    let academic_year_debt = req.query.ay;
    let semester_debt = req.query.sem;

    const query = 
    `
    SELECT * FROM
    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
    AND payment_status = 'Unpaid'
    AND CONCAT(academic_year_issued,semester_issued) <= CONCAT ('${academic_year_debt}', '${semester_debt}')
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);`

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

    let user = req.params.user;

    let academic_year = req.query.ay;
    let semester = req.query.sem;

    const query = 
    `SELECT student_number, member_name, transaction_id, fee_name, fee_amount,
    semester_issued, academic_year_issued, fee_id, due_date, payment_date, payment_status,
    semester, academic_year
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_username = '${user}'
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
    const query = `DELETE FROM fee WHERE fee_id = '${fee_id}';`

    try {
        console.log(query)
        await pool.query(query);
        res.status(200).json({message: "Successfully deleted fee"})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error deleting fee"})
    }
}


// INSERT INTO pays (student_number, fee_id, issue_date, semester_issued,
// academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
// VALUES 
// ('2022-15733', 'FE-00044', '2024-05-02', '1S', '2024-2025', '2024-10-01',
// '2024-12-10', 'Paid', '1S', '2024-2025');


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

// REVISED 5/25/2025
// Delete a status update
const deleteStatusUpdate = async (req, res) => {

    let status_update_id = req.body.student_number;
    let semester = req.body.semester;
    let academic_year = req.body.academic_year;
    let student_number = req.body.student_number;
    let organization_id = req.body.organization_id;

    const query = 
    `DELETE FROM is_part_of WHERE status_update_id = '${status_update_id}' AND 
    semester = '${semester}' AND academic_year = '${academic_year}' AND student_number = '${student_number}'
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

    if (fee_name !==""&&fee_amount!==undefined) {
        updateColumns.push(` fee_name = '${fee_name}'`)
    } 
    if (fee_amount !=="" && fee_amount!==undefined) {
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
        updateColumns.push(` academic_year_issued = ${academic_year_issued}`)
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

// TO DO: Edit to reflect ddl revisions
// Change a status update
// const changeStatusUpdate = async (req, res) => {

//     let committee = req.body.committee;
//     let batch = req.body.batch;
//     let semester = req.body.semester;
//     let academic_year = req.body.academic_year;
//     let role = req.body.role;
//     let membership_status = req.body.membership_status

//     var query = `UPDATE is_part_of SET`;
//     var updateColumnsStr = '';
//     var updateColumns = [];

//     if (committee !=="") {
//         updateColumns.push(` committee = '${committee}'`)
//     } 
//     if (batch !=="") {
//         updateColumns.push(`, batch = '${batch}'`)
//     }
//     if (semester !=="") {
//         updateColumns.push(`, semester = '${semester}'`)
//     } 
//     if (academic_year !== "") {
//         updateColumns.push(`, academic_year = '${academic_year}'`)
//     }
//     if (role !== "") {
//         updateColumns.push(`, role = '${role}'`)
//     } 
//     if (membership_status !== "") {
//         updateColumns.push(`, membership_status=${membership_status}`)
//     }

//     updateColumnsStr = updateColumns.join()

//     if (updateColumnsStr[0]==',') {
//         query = query + updateColumnsStr.slice(1,updateColumnsStr.length)
//     }

//     query += ` WHERE status_update_id = '${status_update_id}';`

//     try {
//         console.log(query)
//         await pool.query(query);
//         res.status(200).json({message: "Successfully updated status update"})
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({message: "Error updating status update"})
//     }

// }

// View all fees
const viewFees = async (req, res) => {

    let user = req.params.user;
    const query = 
    `SELECT fee_id, fee_name, fee_amount, issue_date, semester_issued, academic_year_issued, due_date FROM fee 
    NATURAL JOIN organization WHERE organization_username = '${user}';`

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

    let user = req.params.user;
    const query = 
    `SELECT student_number, member_name, committee, batch, semester,
    academic_year, date_of_status_update, role, membership_status FROM 
    member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_username = '${user}';`

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

    let user = req.params.user;
    const query = 
    `SELECT transaction_id, student_number, member_name, fee_id, fee_amount, fee_name, issue_date, semester_issued,
    academic_year_issued, due_date, payment_date, payment_status, semester, academic_year
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization WHERE organization_username = '${user}';`

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

export {orgInfo, orgUnpaidMembers, orgCommitteeMembers,
        orgRoles, orgCountStatus, orgAlumni, orgFeeStatus, orgHighestDebt, orgLatePayments,
        orgMembers, logIn, addFee, deleteFee, addPays, deletePays, addStatusUpdate, deleteStatusUpdate,
        updateFee, viewFees, viewStatusUpdates, viewTransactions, orgMemberCounts, getOrganizationId,updateTransaction}

