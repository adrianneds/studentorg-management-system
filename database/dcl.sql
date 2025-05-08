DROP VIEW studentorg.feepays_janlevinson 
CREATE VIEW studentorg.feepays_janlevinson AS
(SELECT * FROM organization NATURAL JOIN fee NATURAL JOIN pays WHERE pays.student_number = '2019-04339');
GRANT SELECT ON studentorg.feepays_janlevinson TO 'janlevinson'@'localhost';
SELECT * FROM studentorg.feepays_janlevinson;