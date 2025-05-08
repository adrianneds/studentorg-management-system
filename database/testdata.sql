DELETE FROM `member`;
INSERT INTO member VALUES
    ('2022-04382','pambeesly','pb123','Pam Beesly','F','BS Statistics'),
	('2022-12034','jimhalpert','jh456','Jim Halpert','M','BS Computer Science'),
	('2023-20302','erinhannon','ekh123','Erin Kelly Hannon','F','BS Economics'),
	('2021-20392','dwightschrute','ds456','Dwight Schrute','M','BS Math'),
	('2019-04339','janlevinson','jl123','Jan Levinson','F','BS Math'),
	('2020-93922','andybernard','ab456','Andy Bernard','M','BS Economics'),
	('2020-83492','kellykapoor','kk123','Kelly Kapoor','F','BS Economics')
;

DELETE FROM `organization`;
INSERT INTO organization VALUES
    ('MS-101123','mathsoc','msoc123','Math Society'),
	('ES-101124','econsoc','esoc123','Economics Society')
;

DELETE FROM `is_part_of`;
INSERT INTO is_part_of 
(student_number, organization_id, committee, batch, semester, academic_year, date_of_status_update, role, membership_status)
VALUES
	('2022-04382','MS-101123','Membership','2022B','2S','2022-2023','2022-11-13','Member','Active'),
	('2022-04382','MS-101123','Membership','2022B','1S','2023-2024','2023-10-01','Assistant Head','Active'),
	('2022-04382','MS-101123','Finance','2022B','2S','2023-2024','2024-05-01','Member','Active'),
	('2022-04382','MS-101123','Executive','2022B','1S','2024-2025','2024-10-01','President','Active'),
	('2022-04382','MS-101123','Publicity','2022B','2S','2024-2025','2025-05-01','President','Active'),
	('2019-04339','MS-101123','Finance','2022A','2S','2021-2022','2022-05-01','Member','Active'),
	('2019-04339','MS-101123','Membership','2022A','1S','2022-2023','2022-11-20','Assistant Head','Active'),
	('2019-04339','MS-101123','Executive','2022A','2S','2022-2023','2023-05-01','Member','Inactive'),
	('2019-04339','MS-101123','Executive','2022A','1S','2023-2024','2023-05-01','Treasurer','Active'),
	('2019-04339','MS-101123','Executive','2022A','2S','2023-2024','2024-07-01','Secretary','Alumni'),
	('2023-20302','ES-101124','Publicity','2023B','1S','2023-2024','2023-11-13','Assistant Head','Active'),
	('2023-20302','ES-101124','Finance','2023B','2S','2023-2024','2024-03-15','Member','Active'),
	('2023-20302','ES-101124','Finance','2023B','2S','2024-2025','2025-03-16','Member','Active'),
	('2020-83492','ES-101124','Finance','2025A','2S','2024-2025','2025-04-16','Member','Active'),
	('2020-83492','MS-101123','Finance','2023A','2S','2022-2023','2023-05-01','Assistant Head','Active'),
	('2020-83492','MS-101123','Finance','2023A','1S','2023-2024','2023-10-05','Member','Alumni'),
	('2020-93922','MS-101123','Finance','2024B','1S','2024-2025','2024-10-01','Assistant Head','Active'),
	('2020-93922','MS-101123','Finance','2024B','2S','2024-2025','2025-05-02','Member','Inactive')
;

DELETE FROM `fee`;
INSERT INTO fee VALUES
    ('FE-101193','Membership Fee',80,'MS-101123'),
	('FE-101297','Inactivity Fee',100,'ES-101124'),
	('FE-101392','Membership Fee',100,'ES-101124'),
	('FE-193921','Miscellaneous A',200,'MS-101123'),
	('FE-384922','Miscellaneous B',50,'MS-101123')
;

DELETE FROM `pays`;
INSERT INTO pays 
(student_number, fee_id, issue_date, semester_issued, academic_year_issued, due_date, payment_date, payment_status, semester, academic_year)
VALUES
	('2022-04382','FE-101297','2025-05-01','2S','2024-2025','2025-06-01',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-101193','2022-05-01','2S','2021-2022','2022-06-01','2022-06-01','Paid','2S','2021-2022'),
	('2019-04339','FE-193921','2023-04-21','2S','2022-2023','2023-05-20',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2019-04339','FE-384922','2025-01-01','2S','2024-2025','2025-05-01',NULL,'Unpaid',NULL,NULL),
	('2022-04382','FE-193921','2024-05-21','2S','2023-2024','2024-06-21',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392','2023-10-20','1S','2023-2024','2023-11-20',NULL,'Unpaid',NULL,NULL),
	('2023-20302','FE-101392','2024-10-21','1S','2023-2024','2024-11-21','2025-04-21','Paid','2S','2023-2024'),
	('2022-04382','FE-101193','2024-10-19','1S','2023-2024','2024-11-19','2025-04-19','Paid','2S','2023-2024')
;