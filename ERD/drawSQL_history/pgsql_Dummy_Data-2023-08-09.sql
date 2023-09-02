--Dummy data for users TABLE
--Remark: 現階段假設所有 Users 均由 psql 直接輸入 DB
--Admin users
INSERT INTO users (username, password, admin_auth) VALUES 
    ('Kim','12345', true), ('Angus','12345', true), ('Tim','12345', true);
--Customer users
INSERT INTO users (username, password) VALUES 
    ('Peter','123'), ('Mary','456'), ('John','789');

--Dummy data for products TABLE
--Remark: 現階段假設所有 products 均由 psql 直接輸入 DB
INSERT INTO products (name, price, stock, category) VALUES 
    ('Book 1','99.99',999,'Others'),
    ('Book 2','20',200,'Others'),
    ('Book 3','30',300,'Others'),
    ('Book 4','40',400,'Others');
INSERT INTO products (name, price, stock, category, description) VALUES 
    ('Book 5','50',500,'Cook', 'This book is about JP cooking'),
    ('Book 6','60',600,'Cook', 'This book is about HK cooking'),
    ('Book 7','70',700,'Cook', 'This book is about UK cooking');
--加 products 相片
UPDATE products SET image = 'book1.jpg' WHERE id = 1;
UPDATE products SET image = 'book2.jpg' WHERE id = 2;
UPDATE products SET image = 'book3.png' WHERE id = 3;
UPDATE products SET image = 'book4.jpeg' WHERE id = 4;
UPDATE products SET image = 'book5.jpg' WHERE id = 5;
UPDATE products SET image = 'book6.jpeg' WHERE id = 6;
UPDATE products SET image = 'book7.jpg' WHERE id = 7;

--Dummy data for cart TABLE
--Remark: 假設 Front End 輸出 [username, product_id, quantities]; 再由 Backend 輸入 DB
INSERT INTO cart (user_id, product_id, quantities) VALUES 
    ((SELECT id FROM users WHERE username = 'Peter'), 1,1),
    ((SELECT id FROM users WHERE username = 'Mary'), 1,1),
    ((SELECT id FROM users WHERE username = 'John'), 1,1),
    ((SELECT id FROM users WHERE username = 'John'), 2,20),
    ((SELECT id FROM users WHERE username = 'John'), 3,30),
    ((SELECT id FROM users WHERE username = 'John'), 4,10);
-- 因應 20230817 Update DB TABLE: Set 埋 cart status DEFAULT true
-- 在此前輸入的 cart 要增加以下值
UPDATE cart SET status = true;

--Dummy data for order_info TABLE
--Remark 1: 假設 Front End 輸出 [username, address, remark]; 再由 Backend 輸入 DB
--Remark 2: [status, total_amount] 等待 Back End 計算再輸入 DB
INSERT INTO order_info (invoice_no, user_id, address, remark, status) VALUES 
    ((SELECT nextval('invoice_no')), (SELECT id FROM users WHERE username = 'Mary'), 'HK', 'Nil', 'NEW ORDER');
-- 因應 20230821 Update: ADD COLUMN telephone for order_info
-- 在此前輸入的 order_info 要增加以下值
UPDATE order_info SET telephone = 1234;

--Dummy data for order_items TABLE
--Remark 1: 假設 Front End 輸出 [username, product_id, quantities]; 再由 Backend 輸入 DB
--Remark 2: Unit price 依 product_id 導入 DB 並從此鎖定
--Remark 3: 思考緊由 cart 直接 transfer data 過 order_items 的方法
--Jason reply: Cart 轉 order 方法，可以先用一條 SQL 拎 cart,,, 係 program 入面轉佢 array object,,, 再用 sql 寫入 order
INSERT INTO order_items (user_id, order_id, product_id, quantities, price) VALUES 
    ((SELECT id FROM users WHERE username = 'Mary'), (SELECT id FROM order_info WHERE user_id = (SELECT id FROM users WHERE username = 'Mary')), 1, 11, (SELECT price FROM products WHERE id = 1)),
    ((SELECT id FROM users WHERE username = 'Mary'), (SELECT id FROM order_info WHERE user_id = (SELECT id FROM users WHERE username = 'Mary')), 2, 12, (SELECT price FROM products WHERE id = 2)),
    ((SELECT id FROM users WHERE username = 'Mary'), (SELECT id FROM order_info WHERE user_id = (SELECT id FROM users WHERE username = 'Mary')), 3, 13, (SELECT price FROM products WHERE id = 3));
DELETE FROM cart WHERE user_id = (SELECT id FROM users WHERE username = 'Mary');