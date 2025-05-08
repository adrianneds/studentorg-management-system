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