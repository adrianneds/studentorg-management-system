    SELECT 
    (SELECT SUM(fee_amount) as total_unpaid  
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = 'MS-101123' AND
    ( (payment_status = "Unpaid" AND issue_date <= '${fee_date}')
    OR (payment_status='Paid' AND payment_date >= '${fee_date}' AND issue_date <= '${fee_date}'))) AS unpaid,

    (SELECT SUM(fee_amount) as total_paid         
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = 'MS-101123'
    AND payment_status = "Paid"
    AND payment_date <= '${fee_date}') AS paid;

        `SELECT 
    (SELECT SUM(fee_amount) as total_unpaid  
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = "Unpaid"
    AND issue_date <= '${fee_date}') AS unpaid,

    (SELECT SUM(fee_amount) as total_paid         
    FROM pays NATURAL JOIN fee NATURAL JOIN organization
    WHERE organization_id = '${organization_id}'
    AND payment_status = "Paid"
    AND payment_date <= '${fee_date}') AS paid`