    SELECT
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other, b.semester, b.academic_year
    FROM 
        (SELECT * FROM is_part_of NATURAL JOIN organization WHERE organization_id = 'MS-101123'
        GROUP BY student_number, semester, academic_year) AS b -- status updates of each student tper semester
    GROUP BY b.academic_year, b.semester      
    ORDER BY b.academic_year, b.semester DESC LIMIT 4;