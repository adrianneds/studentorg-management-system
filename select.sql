-- Variable declarations for user input
DECLARE @organization_id VARCHAR;
DECLARE @role VARCHAR;
DECLARE @status VARCHAR;
DECLARE @gender CHAR;
DECLARE @batch VARCHAR;
DECLARE @committee VARCHAR;
DECLARE @semester VARCHAR;
DECLARE @academic_year VARCHAR;

-- TEMPORARY: Set test values for user input

-- (1) filtering
SET @organization_id = "ES-101124";
SET @role = "Member";
SET @membership_status = "Active";
SET @gender = "F";
SET @degree_program = "BS Economics";
SET @batch = "2023A";
SET @committee = "Finance";

-- (2) for late payments
SET @semester = "2S";
SET @academic_year = "2023-2024";

-- 1. View all members of the organization by role, status, gender, degree program, batch
-- (year of membership), and committee. (Note: we assume one committee membership only per
-- organization per semester) 

-- BY ROLE 
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
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member NATURAL JOIN is_part_of
WHERE organization_id = @organization_id
AND gender = @gender;

-- BY DEGREE PROGRAM 
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member NATURAL JOIN is_part_of
WHERE organization_id = @organization_id
AND degree_program = @degree_program;

-- BY BATCH 
SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
b.batch
FROM
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date
    FROM is_part_of WHERE organization_id = @organization_id
    GROUP BY is_part_of.student_number) AS a
JOIN is_part_of AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member AS c
ON (b.student_number = c.student_number)
WHERE batch = @batch;

-- BY COMMITTEE 
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

-- 7. View the percentage of active vs inactive members of a given organization for the last n semesters. (Note: n is a positive integer)



-- 8. View all alumni members of a given organization as of a given date.

-- 9. View the total amount of unpaid and paid fees or dues of a given organization as of a given date.

-- 10. View the member/s with the highest debt of a given organization for a given semester.
