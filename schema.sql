CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INTEGER(11)
    AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR
    (33)  NOT NULL,
	department_name VARCHAR
    (33) NOT NULL,
    price DECIMAL
    (11,2) NOT NULL,
    stock_quantity INTEGER
    (11) NOT NULL
);