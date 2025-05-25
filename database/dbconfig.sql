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
    CONSTRAINT member_studentnumber_pk PRIMARY KEY(student_number),
    CONSTRAINT member_memberusername_uk UNIQUE(member_username)
);

-- ORGANIZATION(Organization_id, Organization_username, Organization_password, Organization_name)

DROP TABLE IF EXISTS `organization`;
CREATE TABLE IF NOT EXISTS organization (
    organization_id VARCHAR(15),
    organization_username VARCHAR(50) NOT NULL,
    organization_password VARCHAR(50) NOT NULL,
    organization_name VARCHAR(70),
    CONSTRAINT organization_organizationid_pk PRIMARY KEY(organization_id),
    CONSTRAINT organization_organizationusername_uk UNIQUE(organization_username)
);

-- IS_PART_OF(Status_update_id, Student_number, Organization_id, Committee, Batch, Semester, Academic_year, Date_of_status_update, Role, Membership_status)

DROP TABLE IF EXISTS `is_part_of`;
CREATE TABLE IF NOT EXISTS is_part_of (
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
    CONSTRAINT ispartof_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT ispartof_organizationid_fk FOREIGN KEY(organization_id) REFERENCES organization(organization_id),
    CONSTRAINT ispartof_pk PRIMARY KEY(
        student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, membership_status
    )
) AUTO_INCREMENT=1000;

-- FEE(Fee_id, Fee_name, Fee_amount, issue_date, semester_issued, academic_year_issued, due_date,  Organization_id)

DROP TABLE IF EXISTS `fee`;
CREATE TABLE IF NOT EXISTS fee (
    fee_id VARCHAR(15),
    fee_name VARCHAR(50),
    fee_amount FLOAT(15) CHECK(fee_amount > 0), -- fee should be a positive number
    issue_date DATE,
    semester_issued CHAR(2) CHECK (semester_issued IN ('1S','2S','M')),
    academic_year_issued CHAR(9),    
    due_date DATE,
    organization_id VARCHAR(15),
    CONSTRAINT fee_feeid_pk PRIMARY KEY(fee_id),
    CONSTRAINT fee_organizationid_fk FOREIGN KEY(organization_id) REFERENCES organization(organization_id)
);

-- PAYS(student_number, fee_id, payment_date, payment_status, semester, academic_year)

DROP TABLE IF EXISTS `pays`;
CREATE TABLE IF NOT EXISTS pays (
    transaction_id INT(4) AUTO_INCREMENT,
    student_number VARCHAR(15),
    fee_id VARCHAR(15),
    payment_date DATE, -- payment date should be after issue date
    payment_status VARCHAR(15) CHECK (payment_status IN ('Paid','Unpaid')), -- only allow such values
    semester CHAR(2) CHECK (semester IN ('1S','2S','M')),                   -- only allow such values
    academic_year CHAR(9) CHECK (academic_year LIKE '%-%'),                 -- specify valid format
    CONSTRAINT pays_transactionid_pk PRIMARY KEY(transaction_id),
    CONSTRAINT pays_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT pays_feeid_fk FOREIGN KEY(fee_id) REFERENCES fee(fee_id)
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
	('2022-04382','MS-101123','Executive','2022B','2S','2024-2025','2025-05-01','President','Active'),
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

-- FEE(Fee_id, Fee_name, Fee_amount, issue_date, semester_issued, academic_year_issued, due_date,  Organization_id)

DELETE FROM `fee`;
INSERT INTO fee VALUES
    ('FE-101193','Membership Fee',80,'2022-05-01','2S','2021-2022','2022-06-01','MS-101123'),
	('FE-101297','Inactivity Fee',100, '2025-05-01', '2S', '2024-2025', '2025-06-01', 'ES-101124'),
	('FE-101392','Membership Fee',100,'2023-10-20','1S','2023-2024','2023-11-20','ES-101124'),
	('FE-193921','Miscellaneous A',200,'2023-04-21','2S','2022-2023','2023-05-20','MS-101123'),
	('FE-384922','Miscellaneous B',50,'2025-01-01','2S','2024-2025','2025-05-01','MS-101123')
;

DELETE FROM `pays`;
INSERT INTO pays 
(student_number, fee_id, payment_date, payment_status, semester, academic_year)
VALUES
	('2022-04382','FE-101297',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-101193','2022-06-01','Paid','2S','2021-2022'),
	('2019-04339','FE-193921',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-384922',NULL,'Unpaid',NULL,NULL),
	('2022-04382','FE-193921',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392','2025-04-21','Paid','2S','2023-2024'),
	('2022-04382','FE-101193','Paid','2S','2025-04-19','2023-2024')
;