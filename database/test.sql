    SELECT * FROM
    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = 'Unpaid'
    AND CONCAT(academic_year_issued,semester_issued) <= CONCAT ('${academic_year_debt}', '${semester_debt}')
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);

    SELECT
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other,
    b.semester, b.academic_year
    FROM 
        (SELECT * FROM is_part_of NATURAL JOIN organization WHERE organization_id = '${organization_id}'
        GROUP BY student_number, semester, academic_year) AS b 
    GROUP BY b.academic_year, b.semester      
    ORDER BY b.academic_year DESC, 
        CASE b.semester
        WHEN '1S' THEN 1
        WHEN 'M'  THEN 2
        WHEN '2S' THEN 3 END DESC
    LIMIT ${n};


    SELECT
    (SUM(CASE WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_active,
    (SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 ELSE 0 END)/COUNT(student_number))*100 AS percent_inactive,
    (1-(SUM(CASE WHEN b.membership_status = "Inactive" THEN 1 WHEN b.membership_status = "Active" THEN 1 ELSE 0 END)/COUNT(student_number)))*100
        AS percent_other,
    b.semester, b.academic_year
    FROM 
        (SELECT * FROM is_part_of NATURAL JOIN organization WHERE organization_id = '${organization_id}'
        GROUP BY student_number, semester, academic_year) AS b 
    GROUP BY b.academic_year, b.semester      
    ORDER BY b.academic_year DESC, b.semester DESC LIMIT ${n};
