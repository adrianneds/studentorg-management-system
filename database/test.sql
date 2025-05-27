    SELECT * FROM
    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'

    -- ensure issued before the given SEM/AY
    AND CONCAT(academic_year_issued, CASE semester WHEN '1S' THEN 1 WHEN 'M' THEN 2 WHEN '2S' THEN 3 END)
    <= CONCAT ('${academic_year_debt}', '${sem}')

    -- ensure not yet paid before the given SEM/AY
    AND 
    (
    (payment_status='Unpaid')
    OR
    (payment_status = 'Paid' AND
    CONCAT(academic_year, CASE semester WHEN '1S' THEN '1' WHEN 'M' THEN '2' WHEN '2S' THEN '3' END) 
    >= CONCAT ('${academic_year_debt}', '${sem}'))
    )
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);


    SELECT * FROM

    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee
    WHERE organization_id = 'MS-101123'

    -- ensure issued before the given SEM/AY
    AND CONCAT(academic_year_issued, CASE semester_issued WHEN '1S' THEN '1' WHEN 'M' THEN '2' WHEN '2S' THEN '3' END)
    <= CONCAT ('2022-2023', '1')

    -- ensure not yet paid before the given SEM/AY
    AND 
    (
    (payment_status='Unpaid')
    OR
    (payment_status = 'Paid' AND
    CONCAT(academic_year, CASE semester WHEN '1S' THEN '1' WHEN 'M' THEN '2' WHEN '2S' THEN '3' END) 
    >= CONCAT ('2022-2023', '1'))
    )
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);



    SELECT * FROM

    (SELECT student_number, member_name, SUM(fee_amount) AS debt
    FROM member NATURAL JOIN pays NATURAL JOIN fee
    WHERE organization_id = '${organization_id}'

    -- ensure issued before the given SEM/AY
    AND CONCAT(academic_year_issued, CASE semester_issued WHEN '1S' THEN '1' WHEN 'M' THEN '2' WHEN '2S' THEN '3' END)
    <= CONCAT ('${academic_year_debt}', '${sem}')

    -- ensure not yet paid before the given SEM/AY
    AND 
    (
    (payment_status='Unpaid')
    OR
    (payment_status = 'Paid' AND
    CONCAT(academic_year, CASE semester WHEN '1S' THEN '1' WHEN 'M' THEN '2' WHEN '2S' THEN '3' END) 
    >= CONCAT ('${academic_year_debt}', '${sem}'))
    )
    GROUP BY student_number, member_name) AS subquery
    HAVING debt = MAX(debt);
