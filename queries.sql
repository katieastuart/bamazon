DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NULL,
  department_name VARCHAR(200) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity int NULL,
  PRIMARY KEY (item_id)
);

select * from products

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(200) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

select * from departments

select distinct department_name from products

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Toys', '100000'),
	('Nail Polish', '70000'),
	('Books', '345000'),
	('Candy', '742000'),
	('Tech', '980000'),
	('Housewares', '56000'),
	('Beauty', '423000')
    
select * from departments

alter table products add column product_sales DECIMAL(10,2) NULL

update products set product_sales = "0.00"

-- SET SQL_SAFE_UPDATES = 0;

select price, product_sales, product_sales + (price * 3) from products

SELECT distinct department_id, d.department_name, over_head_costs, sum(product_sales), sum(product_sales) - over_head_costs as total_profit 
FROM products p join departments d on p.department_name = d.department_name
group by department_name









