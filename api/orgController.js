import {pool, user} from './connect.js';

// View organization's own info
// TEST     : http://localhost:5000/organization/info
// FIELDS   
//     "organization_id": "MS-101123",
//     "organization_username": "mathsoc",
//     "organization_password": "msoc123",
//     "organization_name": "Mathematics Society"
const orgInfo = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM organization_" + user);
    res.send(rows)
};

// TO DO: View members of an organization (with filtering)
const orgMembers = async (req, res) => {

    let committee = req.body.committee;
    let role = req.body.role;
    let status = req.body.status;
    let gender = req.body.gender;
    let degree_program = req.body.degree_program;

    // TO DO: add filtering
    const query = 
    `SELECT * FROM studentorg.member_${user}` ;

    const [rows] = await pool.query("SELECT * FROM ispartof_" + user);
    res.send(rows)
};

// View members with late payments for a given semester/AY
// TEST: http://localhost:5000/organization/unpaidMembers?sem=2S&ay=2023-2024
// FIELDS
//     "student_number": "2022-04382",
//     "member_name": "Pam Beesly",
//     "fee_id": "FE-101193",
//     "due_date": "2024-11-18T16:00:00.000Z",
//     "payment_date": "2025-04-18T16:00:00.000Z",
//     "payment_status": "Paid"
const orgUnpaidMembers = async (req, res) => {
    
    let semester = req.query.sem;                  // need to pass to query
    let academic_year = req.query.ay;            

    const query =
    `SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
    FROM studentorg.pays_${user} NATURAL JOIN studentorg.member_${user}
    WHERE semester = '${semester}' AND academic_year = '${academic_year}'
    AND payment_status = 'Paid' AND payment_date > due_date`;

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
    FROM ispartof_${user} b
    JOIN member_${user} c ON b.student_number = c.student_number
    WHERE b.committee = '${committee}'
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
    FROM ispartof_${user} b
    JOIN member_${user} c ON b.student_number = c.student_number
    WHERE b.role = '${role}'
    ORDER BY b.academic_year DESC;`

    const [rows] = await pool.query(query);
    res.send(rows)
}

// 


export {orgInfo, orgUnpaidMembers, orgCommitteeMembers, orgRoles}

