    SELECT student_number, member_name, gender, degree_program, date_of_status_update, membership_status, batch
    FROM member NATURAL JOIN is_part_of NATURAL JOIN organization
    WHERE organization_id = 'MS-101123'
    AND membership_status = "Alumni"
    AND date_of_status_update <= '2025-05-27';