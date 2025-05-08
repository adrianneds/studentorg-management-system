-- (3) is_part_of - shows only the selected organization
DROP VIEW studentorg.ispartof_mathsoc;
CREATE VIEW studentorg.ispartof_mathsoc AS
    SELECT * FROM is_part_of NATURAL JOIN 
        (SELECT student_number, member_username, member_name,
        gender, degree_program FROM member)
    WHERE organization_id = 'MS-101123';
GRANT SELECT, UPDATE, INSERT ON studentorg.ispartof_mathsoc TO 'mathsoc'@'localhost';
-- SELECT * FROM studentorg.ispartof_mathsoc;
