-- Variable declarations for user input
-- DECLARE @organization_id VARCHAR;
-- DECLARE @role VARCHAR;
-- DECLARE @status VARCHAR;
-- DECLARE @gender CHAR;
-- DECLARE @batch VARCHAR;
-- DECLARE @committee VARCHAR;
-- DECLARE @semester VARCHAR;
-- DECLARE @academic_year VARCHAR;
-- DECLARE @alumni_date DATE;
-- DECLARE @fee_date DATE;
-- DECLARE @n INT;

-- TEMPORARY: Set test values for user input

-- (1) filtering

--SET @organization_id = "ES-101124";
SET @organization_id = "MS-101123";

SET @role = "Member";
SET @membership_status = "Active";
SET @gender = "F";
SET @degree_program = "BS Economics";
SET @batch = "2022A";
SET @committee = "Finance";

-- (6) for late payments
-- SET @semester = "2S";
-- SET @academic_year = "2023-2024";

-- (7)
SET @n = 5;

-- (8) alumni as of a given date
SET @alumni_date = "2024-07-20";

-- (9) for debt
SET @semester = "2S";
SET @academic_year = "2022-2023";

-- (10)
SET @fee_date = "2024-01-01";

-- 1. View all members of the organization by role, status, gender, degree program, batch
-- (year of membership), and committee. (Note: we assume one committee membership only per
-- organization per semester) 

-- BY ROLE
-- test case: Math society members with recent role = "Member"
-- tested: (1) same org, has different prev role; (2) same org, has new role;
--         (3) found role but in a diff org (should not be in output)
SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
b.role
FROM
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date
    FROM is_part_of WHERE organization_id = @organization_id
    GROUP BY is_part_of.student_number) AS a
JOIN is_part_of AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member AS c
ON (b.student_number = c.student_number)
WHERE role = @role;

-- BY STATUS
-- test case: Math society members with recent status = active
-- tested: (1) same org, has different prev status; (2) same org, has new role;
--         (3) found status but in a diff org (should not be in output)
SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
b.membership_status
FROM
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date
    FROM is_part_of WHERE organization_id = @organization_id
    GROUP BY is_part_of.student_number) AS a
JOIN is_part_of AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member AS c
ON (b.student_number = c.student_number)
WHERE membership_status = @membership_status;

-- BY GENDER
-- test case: Math society members with gender = F
-- tested: (1) same gender, diff org (should not be in output)
--         (2) same org, diff gender (should not be in output)
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member NATURAL JOIN is_part_of
WHERE organization_id = @organization_id
AND gender = @gender;

-- BY DEGREE PROGRAM 
-- test case: Math society members with degree program = BS Economics
-- tested: (1) same degree program, diff org (should not be in output)
--         (2) same org, diff degree program (should not be in output)
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member NATURAL JOIN is_part_of
WHERE organization_id = @organization_id
AND degree_program = @degree_program;

-- BY BATCH 
-- test case: Math society members with recent batch = active
-- tested: (1) same batch, diff org (should not be in output)
--         (2) same org, diff batch (should not be in output)
-- ASSUMPTION: batch does not change
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member NATURAL JOIN is_part_of
WHERE organization_id = @organization_id
AND batch = @batch;

-- BY COMMITTEE
-- test case: Math society members with recent committee = Finance
-- tested: (1) same org, has different prev committee; (2) same org, has new committee;
--         (3) found committee but in a diff org (should not be in output)
SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
b.committee
FROM
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date
    FROM is_part_of WHERE organization_id = @organization_id
    GROUP BY is_part_of.student_number) AS a
JOIN is_part_of AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member AS c
ON (b.student_number = c.student_number)
WHERE committee = @committee;

-- 6. View all late payments made by all members of a given organization for a given semester and academic year.

SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
WHERE organization_id = @organization_id
AND semester = @semester AND academic_year = @academic_year
AND payment_status = "Paid" AND payment_date > due_date;

-- 7. View the percentage of active vs inactive members of a given organization for the last n semesters.
-- (Note: n is a positive integer)

-- NOTE: this query assumes a status change only once every semester
SELECT
    SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number) AS c_active,
    SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number) AS c_inactive,
    b.semester, b.academic_year
FROM 
    (SELECT * FROM is_part_of 
    WHERE organization_id = @organization_id
    GROUP BY student_number, semester, academic_year) AS b
GROUP BY b.semester, b.academic_year;
-- CREATE VIEW testview AS SELECT * FROM is_part_of
-- WHERE organization_id = "ES-101124" GROUP BY student_number, semester, academic_year;
-- DROP VIEW testview

-- 8. View all alumni members of a given organization as of a given date.
SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status
FROM member NATURAL JOIN is_part_of NATURAL JOIN organization
WHERE organization_id = @organization_id
AND membership_status = "Alumni"
AND date_of_status_update <= @alumni_date;
-- NOTE: this query assumes that no status updates can be done after Alumni; only one and final Alumni status update

-- 9. View the total amount of unpaid and paid fees or dues of a given organization as of a given date.
SELECT 
    (SELECT SUM(fee_amount) as total_unpaid 
    FROM pays NATURAL JOIN fee
    WHERE organization_id = @organization_id
    AND payment_status = "Unpaid"
    AND issue_date <= @fee_date) AS unpaid,

    (SELECT SUM(fee_amount) as total_paid 
    FROM pays NATURAL JOIN fee
    WHERE organization_id = @organization_id
    AND payment_status = "Paid"
    AND payment_date <= @fee_date) AS paid
;

-- 10. View the member/s with the highest debt of a given organization for a given semester.
SELECT student_number, member_name, SUM(fee_amount) AS debt 
FROM member NATURAL JOIN pays NATURAL JOIN fee
WHERE organization_id = @organization_id
AND payment_status = "Unpaid" AND due_date < CURDATE()
AND semester = @semester AND academic_year = @academic_year
GROUP BY student_number
ORDER BY debt DESC LIMIT 1;
