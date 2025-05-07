-- Delete member/user
DELETE FROM member WHERE student_number = '<student_number>';

-- Delete organization
DELETE FROM organization WHERE organization_id = '<org_id>';

-- Delete fee
DELETE FROM fee WHERE fee_id = '<fee_id>';

-- Delete status change
DELETE FROM is_part_of WHERE status_update_id = '<status_update_id>';

-- Delete transaction
DELETE FROM pays WHERE transaction_id = '<transaction_id>';