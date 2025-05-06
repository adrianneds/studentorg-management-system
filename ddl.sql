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
    gender CHAR(1) CHARACTER SET utf8,
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
    semester CHAR(2),
    academic_year CHAR(9),
    date_of_status_update DATE,
    role VARCHAR(50),
    membership_status VARCHAR(9),
    CONSTRAINT ispartof_statusupdateid_pk PRIMARY KEY(status_update_id),
    CONSTRAINT ispartof_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT ispartof_organizationid_fk FOREIGN KEY(organization_id) REFERENCES organization(organization_id)
) AUTO_INCREMENT=1000;

-- FEE(Fee_id, Fee_name, Fee_amount, Organization_id)

DROP TABLE IF EXISTS `fee`;
CREATE TABLE IF NOT EXISTS fee (
    fee_id VARCHAR(15),
    fee_name VARCHAR(50),
    fee_amount FLOAT(15),
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
    due_date DATE,
    payment_date DATE,
    payment_status VARCHAR(15),
    semester CHAR(2),
    academic_year CHAR(9),
    CONSTRAINT pays_transactionid_pk PRIMARY KEY(transaction_id),
    CONSTRAINT pays_studentnumber_fk FOREIGN KEY(student_number) REFERENCES member(student_number),
    CONSTRAINT pays_feeid_fk FOREIGN KEY(fee_id) REFERENCES fee(fee_id)

) AUTO_INCREMENT=1000;

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