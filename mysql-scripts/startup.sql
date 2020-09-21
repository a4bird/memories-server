UPDATE mysql.user SET Host='%' WHERE Host='localhost' AND User='root';
UPDATE mysql.db SET Host='%' WHERE Host='localhost' AND User='root';
 
 