import {pool, user} from './connect.js';

// TO DO: view organization's own info
const orgInfo = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM organization_" + user);
    res.send(rows)
};

// TO DO: view members of an organization (with filtering)
const orgMembers = async (req, res) => {

    let committee = req.body.committee;
    let role = req.body.role;
    let status = req.body.status;
    let gender = req.body.gender;
    let degree_program = req.body.degree_program;

    const query = 
    `SELECT * FROM studentorg.member_${user}` ;

    const [rows] = await pool.query("SELECT * FROM ispartof_" + user);
    res.send(rows)
};

// TO DO: view members with late payments for a given semester/AY
const orgUnpaidMembers = async (req, res) => {
    
    let semester = req.query.semester;                  // need to pass to query
    let academic_year = req.query.academic_year;            

    const query =
    `SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
    FROM studentorg.pays_${user} NATURAL JOIN studentorg.member_${user}
    AND semester = ${semester} AND academic_year = ${academic_year}
    AND payment_status = 'Paid' AND payment_date > due_date`;

    const [rows] = await pool.query(query);
    res.send(rows)
};

// TO DO: view members of a specific committee


export {orgInfo}
// SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
// b.committee
// FROM
//     (SELECT student_number, MAX(date_of_status_update) as recent_status_date
//     FROM is_part_of WHERE organization_id = @organization_id
//     GROUP BY is_part_of.student_number) AS a
// JOIN is_part_of AS b 
// ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
// JOIN member AS c
// ON (b.student_number = c.student_number)
// WHERE committee = @committee;