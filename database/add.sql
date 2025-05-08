-- Add new member (user)
INSERT INTO member (student_number, member_username, member_password, member_name, gender, degree_program)
VALUES ('<student_number>', '<username>', '<password>', '<full_name>', '<gender>', '<degree_program>');

-- Add new organization
INSERT INTO organization (organization_id, organization_username, organization_password, organization_name)
VALUES ('<org_id>', '<username>', '<password>', '<org_name>');

-- Add new fee
INSERT INTO fee (fee_id, fee_name, fee_amount, organization_id)
VALUES ('<fee_id>', '<fee_name>', <amount>, '<org_id>');

-- Add new status change (is_part_of)
INSERT INTO is_part_of (student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, role, membership_status)
VALUES ('<student_number>', '<org_id>', '<committee>', '<batch>', '<semester>', '<academic_year>', '<status_date>', '<role>', '<status>');

-- Add new transaction (pays)
INSERT INTO pays (student_number, fee_id, issue_date, semester_issued, academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
VALUES ('<student_number>', '<fee_id>', '<issue_date>', '<sem_issued>', '<acad_issued>', '<due_date>', '<payment_date>', '<status>', '<sem>', '<acad_year>');