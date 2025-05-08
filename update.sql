-- STUDENT
-- Update degree program of the student
UPDATE studentorg.member_janlevinson SET degree_program = 'BS Statistics' WHERE student_number = '2019-04339';

-- ORGANIZATION
-- (1) Update name of the organization
UPDATE studentorg.organization_mathsoc SET organization_name = 'Mathematics Society' WHERE organization_id = 'MS-101123';

-- (2) Update amount of fee
UPDATE studentorg.fee_mathsoc SET fee_amount = 90 WHERE fee_id = 'FE-101193';

-- (3) Update transaction
UPDATE studentorg.pays_mathsoc SET payment_status = 'Paid' WHERE transaction_id = '1000';
