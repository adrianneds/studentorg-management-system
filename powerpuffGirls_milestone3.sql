---------------------------------------------------------------------------------------------
-- Milestone 3: SQL Queries
-- Powerpuff Girls (Eugenio, Solis, Victoria)
-- CMSC 127 ST2-8L
---------------------------------------------------------------------------------------------
-- <<Contents>> (can search in file)

--  id         section
-- [01]     DDL Statements
-- [02]     Inserting Test Data
-- [03]     DCL Statements
-- [04]     SELECT statements for required features
-- [05]     INSERT new data
-- [06]     DELETE a student, organization, fee, or specific status update/transaction
-- [07]     UPDATE existing data
---------------------------------------------------------------------------------------------

-- [01]     DDL Statements

DROP DATABASE IF EXISTS `studentorg`;
CREATE DATABASE IF NOT EXISTS `studentorg`;
USE `studentorg`;

-- MEMBER(Student_number, Member_username, Member_password, Member_name, Gender, Degree_program)

DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS member(
    student_number VARCHAR(15),
    member_username VARCHAR(50) NOT NULL, 
    member_password VARCHAR(50) NOT NULL,
    member_name VARCHAR(70),
    gender CHAR(1) CHARACTER SET utf8 CHECK (gender IN ('M','F')),  -- only allow such values
    degree_program VARCHAR(70),
    CONSTRAINT member_studentnumber_pk PRIMARY KEY(student_number)
);

-- ORGANIZATION(Organization_id, Organization_username, Organization_password, Organization_name)

DROP TABLE IF EXISTS `organization`;
CREATE TABLE IF NOT EXISTS organization (
    organization_id VARCHAR(15),
    organization_username VARCHAR(50) NOT NULL,
    organization_password VARCHAR(50) NOT NULL,
    organization_name VARCHAR(70),
    CONSTRAINT organization_organizationid_pk PRIMARY KEY(organization_id)
);

-- IS_PART_OF(Status_update_id, Student_number, Organization_id, Committee, Batch, Semester, Academic_year, Date_of_status_update, Role, Membership_status)

DROP TABLE IF EXISTS `is_part_of`;
CREATE TABLE IF NOT EXISTS is_part_of (
    status_update_id INT(4) AUTO_INCREMENT,
    student_number VARCHAR(15),
    organization_id VARCHAR(15),
    committee VARCHAR(50),
    batch VARCHAR(20),
    semester CHAR(2) CHECK (semester IN ('1S','2S','M')),
    academic_year CHAR(9) CHECK (academic_year LIKE '%-%'),
    -- ensure that date is within academic year
    date_of_status_update DATE CHECK( YEAR(date_of_status_update)
        BETWEEN SUBSTRING(academic_year,1,4) AND SUBSTRING(academic_year, 6,4)),
    role VARCHAR(50),
    membership_status VARCHAR(9) CHECK (
        membership_status IN ('Active','Inactive','Expelled','Suspended','Alumni')), -- only allow such values
    CONSTRAINT ispartof_statusupdateid_pk PRIMARY KEY(status_update_id),
    CONSTRAINT ispartof_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT ispartof_organizationid_fk FOREIGN KEY(organization_id) REFERENCES organization(organization_id),
    CONSTRAINT ispartof_studentnumber_semester_academicyear_uk UNIQUE(student_number, semester, academic_year) -- only one update per sem
) AUTO_INCREMENT=1000;

-- FEE(Fee_id, Fee_name, Fee_amount, Organization_id)

DROP TABLE IF EXISTS `fee`;
CREATE TABLE IF NOT EXISTS fee (
    fee_id VARCHAR(15),
    fee_name VARCHAR(50),
    fee_amount FLOAT(15) CHECK(fee_amount > 0), -- fee should be a positive number
    organization_id VARCHAR(15),
    CONSTRAINT fee_feeid_pk PRIMARY KEY(fee_id),
    CONSTRAINT fee_organizationid_fk FOREIGN KEY(organization_id) REFERENCES organization(organization_id)
);

-- PAYS(Transaction_id, Student_number, Fee_id, Due_date, Payment_date, Payment_status, Semester, Academic_year)

DROP TABLE IF EXISTS `pays`;
CREATE TABLE IF NOT EXISTS pays (
    transaction_id INT(4) AUTO_INCREMENT,
    student_number VARCHAR(15),
    fee_id VARCHAR(15),
    issue_date DATE,
    semester_issued CHAR(2) CHECK (semester_issued IN ('1S','2S','M')),
    academic_year_issued CHAR(9),
    due_date DATE CHECK(due_date >= issue_date),          -- due date should be after issue date 
    payment_date DATE CHECK (payment_date >= issue_date), -- payment date should be after issue date
    payment_status VARCHAR(15) CHECK (payment_status IN ('Paid','Unpaid')), -- only allow such values
    semester CHAR(2) CHECK (semester IN ('1S','2S','M')),                   -- only allow such values
    academic_year CHAR(9) CHECK (academic_year LIKE '%-%'),                 -- specify valid format
    CONSTRAINT pays_transactionid_pk PRIMARY KEY(transaction_id),
    CONSTRAINT pays_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT pays_feeid_fk FOREIGN KEY(fee_id) REFERENCES fee(fee_id),
    -- issue date should be before payment date and be within the academic year issued
    CONSTRAINT issue_date_valid CHECK((issue_date <= payment_date AND
        YEAR(issue_date) BETWEEN SUBSTRING(academic_year_issued,1,4) AND SUBSTRING(academic_year_issued, 6,4)))
) AUTO_INCREMENT=1000;

---------------------------------------------------------------------------------------------
-- [02]     Inserting Test Data

DELETE FROM `member`;
INSERT INTO member VALUES
    ('2022-04382','pambeesly','pb123','Pam Beesly','F','BS Statistics'),
	('2022-12034','jimhalpert','jh456','Jim Halpert','M','BS Computer Science'),
	('2023-20302','erinhannon','ekh123','Erin Kelly Hannon','F','BS Economics'),
	('2021-20392','dwightschrute','ds456','Dwight Schrute','M','BS Math'),
	('2019-04339','janlevinson','jl123','Jan Levinson','F','BS Math'),
	('2020-93922','andybernard','ab456','Andy Bernard','M','BS Economics'),
	('2020-83492','kellykapoor','kk123','Kelly Kapoor','F','BS Economics')
;

DELETE FROM `organization`;
INSERT INTO organization VALUES
    ('MS-101123','mathsoc','msoc123','Math Society'),
	('ES-101124','econsoc','esoc123','Economics Society')
;

DELETE FROM `is_part_of`;
INSERT INTO is_part_of 
(student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, role, membership_status)
VALUES
	('2022-04382','MS-101123','Membership','2022B','2S','2022-2023','2022-11-13','Member','Active'),
	('2022-04382','MS-101123','Membership','2022B','1S','2023-2024','2023-10-01','Assistant Head','Active'),
	('2022-04382','MS-101123','Finance','2022B','2S','2023-2024','2024-05-01','Member','Active'),
	('2022-04382','MS-101123','Executive','2022B','1S','2024-2025','2024-10-01','President','Active'),
	('2022-04382','MS-101123','Publicity','2022B','2S','2024-2025','2025-05-01','President','Active'),
	('2019-04339','MS-101123','Finance','2022A','2S','2021-2022','2022-05-01','Member','Active'),
	('2019-04339','MS-101123','Membership','2022A','1S','2022-2023','2022-11-20','Assistant Head','Active'),
	('2019-04339','MS-101123','Executive','2022A','2S','2022-2023','2023-05-01','Member','Inactive'),
	('2019-04339','MS-101123','Executive','2022A','1S','2023-2024','2023-05-01','Treasurer','Active'),
	('2019-04339','MS-101123','Executive','2022A','2S','2023-2024','2024-07-01','Secretary','Alumni'),
	('2023-20302','ES-101124','Publicity','2023B','1S','2023-2024','2023-11-13','Assistant Head','Active'),
	('2023-20302','ES-101124','Finance','2023B','2S','2023-2024','2024-03-15','Member','Active'),
	('2023-20302','ES-101124','Finance','2023B','2S','2024-2025','2025-03-16','Member','Active'),
	('2020-83492','ES-101124','Finance','2025A','2S','2024-2025','2025-04-16','Member','Active'),
	('2020-83492','MS-101123','Finance','2023A','2S','2022-2023','2023-05-01','Assistant Head','Active'),
	('2020-83492','MS-101123','Finance','2023A','1S','2023-2024','2023-10-05','Member','Alumni'),
	('2020-93922','MS-101123','Finance','2024B','1S','2024-2025','2024-10-01','Assistant Head','Active'),
	('2020-93922','MS-101123','Finance','2024B','2S','2024-2025','2025-05-02','Member','Inactive')
;

DELETE FROM `fee`;
INSERT INTO fee VALUES
    ('FE-101193','Membership Fee',80,'MS-101123'),
	('FE-101297','Inactivity Fee',100,'ES-101124'),
	('FE-101392','Membership Fee',100,'ES-101124'),
	('FE-193921','Miscellaneous A',200,'MS-101123'),
	('FE-384922','Miscellaneous B',50,'MS-101123')
;

DELETE FROM `pays`;
INSERT INTO pays 
(student_number, fee_id, issue_date, semester_issued, academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
VALUES
	('2022-04382','FE-101297','2025-05-01','2S','2024-2025','2025-06-01',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-101193','2022-05-01','2S','2021-2022','2022-06-01','2022-06-01','Paid','2S','2021-2022'),
	('2019-04339','FE-193921','2023-04-21','2S','2022-2023','2023-05-20',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-384922','2025-01-01','2S','2024-2025','2025-05-01',NULL,'Unpaid',NULL,NULL),
	('2022-04382','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392','2023-10-20','1S','2023-2024','2023-11-20',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392','2024-10-21','1S','2023-2024','2024-11-21','2025-04-21','Paid','2S','2023-2024'),
	('2022-04382','FE-101193','2024-10-19','1S','2023-2024','2024-11-19','2025-04-19','Paid','2S','2023-2024')
;

---------------------------------------------------------------------------------------------
-- [03]     DCL Statements

-- TEMPORARY test values

DROP USER 'janlevinson'@'localhost';
DROP USER 'mathsoc'@'localhost';

-- CREATE USERS: member and organization
CREATE USER 'janlevinson'@'localhost' IDENTIFIED BY 'jl123';
CREATE USER 'mathsoc'@'localhost' IDENTIFIED BY 'msoc123';

-- CREATE VIEWS: to limit their access on the rows concerning the specific member / organization only
-- MEMBER
-- (1) member - shows only the details of the student
CREATE VIEW studentorg.member_janlevinson AS
    SELECT * FROM member
    WHERE student_number = '2019-04339';
GRANT SELECT, UPDATE ON studentorg.member_janlevinson TO 'janlevinson'@'localhost';
-- SELECT * FROM studentorg.member_janlevinson;

-- (2) pays - shows only the payments of the students
CREATE VIEW studentorg.feepays_janlevinson AS
(SELECT * FROM organization NATURAL JOIN fee NATURAL JOIN pays WHERE pays.student_number = '2019-04339');
GRANT SELECT ON studentorg.feepays_janlevinson TO 'janlevinson'@'localhost';

-- ORGANIZATION
-- (1) member - shows only members from the selected organization
CREATE VIEW studentorg.member_mathsoc AS
    SELECT student_number, member_username, member_name, gender, degree_program FROM member NATURAL JOIN organization
    WHERE organization_id = 'MS-101123';
GRANT SELECT, INSERT ON studentorg.member_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.member_mathsoc;


-- (2) organization - shows the username and password of the organization only
CREATE VIEW studentorg.organization_mathsoc AS
    SELECT * FROM organization
    WHERE organization_id = 'MS-101123';
GRANT SELECT, UPDATE, DELETE ON studentorg.organization_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.organization_mathsoc;


-- (3) is_part_of - shows only the selected organization
CREATE VIEW studentorg.ispartof_mathsoc AS
    SELECT * FROM is_part_of
    WHERE organization_id = 'MS-101123';
GRANT SELECT, UPDATE, INSERT ON studentorg.ispartof_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.ispartof_mathsoc;


-- (4) fee - shows only the fees in the selected organization
CREATE VIEW studentorg.fee_mathsoc AS
    SELECT * FROM fee
    WHERE organization_id = 'MS-101123';
GRANT ALL ON studentorg.fee_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.fee_mathsoc;


-- (5) pays - shows only the payments of the members of the selected organization
CREATE VIEW studentorg.pays_mathsoc AS
    SELECT * FROM pays NATURAL JOIN fee
    WHERE organization_id = 'MS-101123';
GRANT ALL ON studentorg.pays_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.pays_mathsoc;

---------------------------------------------------------------------------------------------
-- [04]     SELECT statements for required features
--  Note: In actual implementation, queries will be through views of the logged in user
--        Math Society will be used as a test case for sample queries (mathsoc views)

-- TEMPORARY: Set test values for user input

-- (1) filtering
--SET @organization_id = "ES-101124";
-- SET @organization_id = "MS-101123";

SET @role = "Member";
SET @membership_status = "Active";
SET @gender = "F";
SET @degree_program = "BS Economics";
SET @batch = "2022A";
SET @committee = "Finance";

-- (6)
SET @semester = "2S";
SET @academic_year = "2022-2023";

-- (8) alumni as of a given date
SET @alumni_date = "2024-07-20";

-- (9)
SET @fee_date = "2024-01-01";

-- (10) for debt
SET @academic_year_debt = "2024-2025";
SET @semester_debt = "1S";

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
--  no semester/AY specified, so find most recent status update
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date 
    FROM ispartof_mathsoc 
    GROUP BY ispartof_mathsoc.student_number) AS a
JOIN ispartof_mathsoc AS b
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member_mathsoc AS c -- join with member view to get member name, gender, other info
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
    FROM ispartof_mathsoc
    GROUP BY ispartof_mathsoc.student_number) AS a
JOIN ispartof_mathsoc AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member_mathsoc AS c
ON (b.student_number = c.student_number)
WHERE membership_status = @membership_status;

-- BY COMMITTEE
-- test case: Math society members with recent committee = Finance
-- tested: (1) same org, has different prev committee; (2) same org, has new committee;
--         (3) found committee but in a diff org (should not be in output)
SELECT c.student_number, c.member_name, c.gender, c.degree_program, a.recent_status_date,
b.committee
FROM
    (SELECT student_number, MAX(date_of_status_update) as recent_status_date
    FROM ispartof_mathsoc
    GROUP BY ispartof_mathsoc.student_number) AS a
JOIN ispartof_mathsoc AS b 
ON (a.recent_status_date = b.date_of_status_update AND a.student_number = b.student_number)
JOIN member_mathsoc AS c
ON (b.student_number = c.student_number)
WHERE committee = @committee;

-- BY GENDER
-- test case: Math society members with gender = F
-- tested: (1) same gender, diff org (should not be in output)
--         (2) same org, diff gender (should not be in output)
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member_mathsoc NATURAL JOIN ispartof_mathsoc
WHERE gender = @gender;

-- BY DEGREE PROGRAM 
-- test case: Math society members with degree program = BS Economics
-- tested: (1) same degree program, diff org (should not be in output)
--         (2) same org, diff degree program (should not be in output)
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member_mathsoc NATURAL JOIN ispartof_mathsoc
WHERE degree_program = @degree_program;

-- BY BATCH 
-- test case: Math society members with recent batch = active
-- tested: (1) same batch, diff org (should not be in output)
--         (2) same org, diff batch (should not be in output)
-- ASSUMPTION: batch does not change
SELECT DISTINCT student_number, member_name, gender, degree_program
FROM member_mathsoc NATURAL JOIN ispartof_mathsoc
WHERE batch = @batch;

-- 4. View all executive committee members of a given organization for a given academic year.
SELECT DISTINCT c.student_number, c.member_name, b.committee, b.role, b.academic_year
FROM ispartof_mathsoc b
JOIN member_mathsoc c ON b.student_number = c.student_number -- to get student info
WHERE b.committee = 'Executive'
AND b.academic_year = @academic_year;

----- equivalent to:
-- SELECT DISTINCT c.student_number, c.member_name, b.committee, b.role, b.academic_year
-- FROM is_part_of b
-- JOIN member c ON b.student_number = c.student_number
-- WHERE b.organization_id = @organization_id
-- AND b.committee = 'Executive'
-- AND b.academic_year = @academic_year;

-- 5. View all Presidents (or any other role) of a given organization for every academic year (reverse chronological)
SELECT DISTINCT c.student_number, c.member_name, b.role, b.academic_year
FROM ispartof_mathsoc b
JOIN member_mathsoc c ON b.student_number = c.student_number -- to get student info
WHERE b.role = 'President'
ORDER BY b.academic_year DESC;

----- template:
-- SELECT DISTINCT c.student_number, c.member_name, b.role, b.academic_year
-- FROM is_part_of b
-- JOIN member c ON b.student_number = c.student_number
-- WHERE b.organization_id = @organization_id
-- AND b.role = 'President'
-- ORDER BY b.academic_year DESC;

-- 6. View all late payments made by all members of a given organization for a given semester and academic year.
SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
FROM member_mathsoc NATURAL JOIN pays_mathsoc NATURAL JOIN fee_mathsoc NATURAL JOIN organization_mathsoc
WHERE semester = @semester AND academic_year = @academic_year
AND payment_status = "Paid" AND payment_date > due_date; -- classifying late payments

----- template:
-- SELECT student_number, member_name, fee_id, due_date, payment_date, payment_status 
-- FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
-- WHERE organization_id = @organization_id
-- AND semester = @semester AND academic_year = @academic_year
-- AND payment_status = "Paid" AND payment_date > due_date;

-- 7. View the percentage of active vs inactive members of a given organization for the last n semesters.
-- (Note: n is a positive integer)

-- NOTE: this query assumes a status change only once every semester
SELECT
--  count active, inactive, and other (e.g, alumni) status
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other,
    b.semester, b.academic_year
FROM 
    (SELECT * FROM ispartof_mathsoc
    GROUP BY student_number, semester, academic_year) AS b -- get each students status update per sem/ay
GROUP BY b.academic_year, b.semester        -- count is per semester
ORDER BY b.semester, b.academic_year DESC LIMIT 3; -- NOTE: in implementation, replace 3 with user input

-- 8. View all alumni members of a given organization as of a given date.
-- NOTE: this query assumes that no status updates can be done after Alumni; only one and final Alumni status update
SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status
FROM member_mathsoc NATURAL JOIN ispartof_mathsoc NATURAL JOIN organization_mathsoc
WHERE membership_status = "Alumni"
AND date_of_status_update <= @alumni_date;   -- find all who were alumni before/on given date

-- 9. View the total amount of unpaid and paid fees or dues of a given organization as of a given date.
SELECT 
    (SELECT SUM(fee_amount) as total_unpaid         -- sum all unpaid fees
    FROM pays_mathsoc NATURAL JOIN fee_mathsoc
    WHERE payment_status = "Unpaid"
    AND issue_date <= @fee_date) AS unpaid,         -- count only payments issued on/before given date

    (SELECT SUM(fee_amount) as total_paid           -- sum all paid fees
    FROM pays_mathsoc NATURAL JOIN fee_mathsoc
    WHERE payment_status = "Paid"
    AND payment_date <= @fee_date) AS paid          -- avoid counting transactions paid beyond the given date
;

-- 10. View the member/s with the highest debt of a given organization for a given semester.
--     interpreted as outstanding balance for all previous semesters until given semester
SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member_mathsoc NATURAL JOIN pays_mathsoc NATURAL JOIN fee_mathsoc
    WHERE payment_status = "Unpaid"
    -- consider payments made on/before given sem/AY
    AND CONCAT(academic_year_issued,semester_issued) <= CONCAT (@academic_year_debt, @semester_debt) 
    GROUP BY student_number
    ORDER BY debt DESC LIMIT 1 -- get member with highest debt
;
---------------------------------------------------------------------------------------------
-- [05]     INSERT new data

-- Add new member (user)
INSERT INTO member (student_number, member_username, member_password, member_name, gender, degree_program)
VALUES ('2022-15733', 'michaelscott', 'mscott456', 'Michael Scott', 'M', 'BS Biology');

-- Add new organization
INSERT INTO organization (organization_id, organization_username, organization_password, organization_name)
VALUES ('BS-101134', 'biosoc', 'bsoc123', 'Biology Society');

-- Add new fee
INSERT INTO fee (fee_id, fee_name, fee_amount, organization_id)
VALUES ('FE-00044', 'Membership Fee', '100', 'BS-101134');

-- Add new status change (is_part_of)
INSERT INTO is_part_of (student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, role, membership_status)
VALUES ('2022-15733', 'BS-101134', 'Executive', '2024A', '2S', '2023-2024', '2024-05-01', 'President', 'Active');

INSERT INTO is_part_of (student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, role, membership_status)
VALUES ('2022-15733', 'BS-101134', 'Executive', '2024A', '1S', '2024-2025', '2024-10-01', 'Secretary', 'Active');

-- Add new transaction (pays)
INSERT INTO pays (student_number, fee_id, issue_date, semester_issued, academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
VALUES ('2022-15733', 'FE-00044', '2024-05-01', '2S', '2023-2024', '2024-06-01', '2024-05-20', 'Paid', '2S', '2023-2024');

INSERT INTO pays (student_number, fee_id, issue_date, semester_issued, academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
VALUES ('2022-15733', 'FE-00044', '2024-05-02', '1S', '2024-2025', '2024-10-01', '2024-12-10', 'Paid', '1S', '2024-2025');

-- test:
SELECT * FROM member WHERE student_number = '2022-15733';
SELECT * FROM organization WHERE organization_id = 'BS-101134';
SELECT * FROM is_part_of WHERE student_number = '2022-15733';
SELECT * FROM fee WHERE fee_id = 'FE-00044';
SELECT * FROM pays WHERE fee_id = 'FE-00044';

-- status update id and transaction id have auto incrementing primary keys
SELECT * FROM is_part_of WHERE status_update_id = '1019';
SELECT * FROM pays WHERE transaction_id = '1011';

---------------------------------------------------------------------------------------------
-- [06]     DELETE a student, organization, fee, or specific status update/transaction

-- NOTE: in actual implementation, deletion of one member / organization / fee also deletes
--       referenced entries in other tables. for now, the queries are listed in order

-- Deleting student 2022-15733 (Michael Scott) also deletes fee and status records
DELETE FROM is_part_of WHERE student_number = '2022-15733';
DELETE FROM pays WHERE student_number = '2022-15733';
DELETE FROM member WHERE student_number = '2022-15733';

-- Deleting organization also deletes their fees and member records
DELETE FROM is_part_of WHERE organization_id = 'BS-101134';
DELETE pays FROM pays NATURAL JOIN fee WHERE organization_id = 'BS-101134';
DELETE FROM fee WHERE organization_id = 'BS-101134';
DELETE FROM organization WHERE organization_id = 'BS-101134';

-- Deleting a fee also deletes related transactions
DELETE FROM pays WHERE fee_id = 'FE-00044';
DELETE FROM fee WHERE fee_id = 'FE-00044';

-- Can also have standalone queries for deleting individual status updates and transactions
DELETE FROM pays WHERE transaction_id = '1012';
DELETE FROM is_part_of WHERE status_update_id = '1020';

-- test: should return empty
SELECT * FROM member WHERE student_number = '2022-15733';
SELECT * FROM organization WHERE organization_id = 'BS-101134';
SELECT * FROM is_part_of WHERE student_number = '2022-15733';
SELECT * FROM fee WHERE fee_id = 'FE-00044';
SELECT * FROM pays WHERE fee_id = 'FE-00044';
SELECT * FROM pays WHERE transaction_id = '1012';
SELECT * FROM is_part_of WHERE status_update_id = '1020';

---------------------------------------------------------------------------------------------
-- [07]     UPDATE existing data
-- Update degree program of the student
UPDATE studentorg.member_janlevinson SET degree_program = 'BS Statistics' WHERE student_number = '2019-04339';

-- ORGANIZATION
-- (1) Update name of the organization
UPDATE studentorg.organization_mathsoc SET organization_name = 'Mathematics Society' WHERE organization_id = 'MS-101123';

-- (2) Update amount of fee
UPDATE studentorg.fee_mathsoc SET fee_amount = 90 WHERE fee_id = 'FE-101193';

-- (3) Update transaction
UPDATE studentorg.pays_mathsoc SET payment_status = 'Paid' WHERE transaction_id = '1000';

-- test
SELECT * FROM member WHERE student_number = '2019-04339';
SELECT * FROM organization WHERE organization_id = 'MS-101123';
SELECT * FROM fee WHERE fee_id = 'FE-101193';
SELECT * FROM pays WHERE transaction_id = '1000';


