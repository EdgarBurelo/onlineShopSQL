CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    -- item_id INTEGER(11) PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(33)  NOT NULL,
	department_name VARCHAR(33) NOT NULL,
    price DECIMAL(11,2) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL
);

CREATE TABLE departments
(
    department_id INTEGER(11) PRIMARY KEY,
    department_name VARCHAR(33) NOT NULL,
    over_head_costs INTEGER(11) NOT NULL
);

ALTER TABLE products ADD product_sales DECIMAL(11,2);

UPDATE products 
SET product_sales = 0
WHERE item_id < 13;

SELECT *
FROM departments;

SELECT *
FROM departments
LEFT JOIN products
ON departments.department_name = products.department_name;

SELECT *
FROM products;

SELECT x.department_id, x.department_name, x.over_head_costs, y.product_sales, y.product_sales - x.over_head_costs AS total_profit
FROM departments x
INNER JOIN (SELECT products.department_name, SUM(products.product_sales) AS product_sales
FROM products
GROUP BY department_name) y
ON x.department_name = y.department_name;

