-- TEMPORARY test values

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
CREATE VIEW studentorg.pays_janlevinson AS
    SELECT * FROM pays
    WHERE student_number = '2019-04339';
GRANT SELECT ON studentorg.pays_janlevinson TO 'janlevinson'@'localhost';
-- SELECT * FROM studentorg.pays_janlevinson;


-- ORGANIZATION
-- (1) member - shows only members from the selected organization
CREATE VIEW studentorg.member_mathsoc AS
    SELECT student_number, member_username, member_name, gender, degree_program FROM member
    WHERE student_number IN ('2019-04339','2022-04382','2020-93922');
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
    SELECT * FROM pays
    WHERE fee_id IN ('FE-101193', 'FE-193921');
GRANT ALL ON studentorg.pays_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.pays_mathsoc;
