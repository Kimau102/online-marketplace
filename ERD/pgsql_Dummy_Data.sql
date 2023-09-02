--Dummy data for users TABLE
--Admin users
INSERT INTO users (username, password, admin_auth, email, telephone, address) VALUES 
    ('Kim','12345', true, 'kim@shop.com', '23456789', 'Hong Kong'), 
    ('Angus','12345', true, 'angus@shop.com', '23456789', 'Hong Kong'), 
    ('Tim','12345', true, 'tim@shop.com', '23456789', 'Hong Kong');
--Customer users
INSERT INTO users (username, password, email, telephone, address) VALUES 
    ('Peter','123', 'peter@shop.com', '43456789', 'Wan Chai'),
    ('Mary','456', 'mary@shop.com', '53456789', 'Mars'), 
    ('John','789', 'john@shop.com', '63456789', 'Causeway Bay');

--Dummy data for products TABLE
--齊料產品
INSERT INTO products (name, price, stock, category, description, image) VALUES 
    ('彩色溫泉','99.99',999,'Child', 'This book is about spring in Japan', 'book1.jpg'),
    ('弟弟我要送給你…','20',200,'Child', 'This book is about brother and sister', 'book2.jpg'),
    ('幸福窮日子','30',300,'Child', 'This book is about family', 'book3.png'),
    ('啟思中國語文(小一)','40',400,'Education', 'This book is about Chinese Language at P1', 'book4.jpeg'),
    ('啟思中國語文(中一)','50',500,'Education', 'This book is about Chinese Language at S1', 'book5.jpg'),
    ('我有大煩惱','60',600,'Child', 'This book is about troubles', 'book6.jpeg'),
    ('大蘿蔔','70',700,'Cook', 'This book is about cooking', 'book7.jpg');
--沒有圖片和介紹和種類的產品
INSERT INTO products (name, price, stock) VALUES 
    ('沒有圖片和介紹的書本','80',800);
-- 因應 20230829 Update DB TABLE: Set 埋 products status DEFAULT true
-- 在此前輸入的 products 要增加以下值
UPDATE products SET status = true;

--Dummy data for cart TABLE
INSERT INTO cart (user_id, product_id, quantities) VALUES 
    (4, 1,1),
    (5, 1,1),
    (6, 1,1),
    (6, 2,20),
    (6, 3,30),
    (6, 4,10);

--Dummy data for order_info TABLE
INSERT INTO order_info (invoice_no, user_id, address, telephone, remark, status, total_amount) VALUES 
    ((SELECT nextval('invoice_no')), 5, 'HK', '53456789', 'Nil', 'NEW ORDER', '200');

--Dummy data for order_items TABLE
--Remark 1: 假設 Front End 輸出 [username, product_id, quantities]; 再由 Backend 輸入 DB
--Remark 2: Unit price 依 product_id 導入 DB 並從此鎖定
--Remark 3: 思考緊由 cart 直接 transfer data 過 order_items 的方法
--Jason reply: Cart 轉 order 方法，可以先用一條 SQL 拎 cart,,, 係 program 入面轉佢 array object,,, 再用 sql 寫入 order
--現行運作: Front End + Backend 輸出 [user_id, order_id, product_id, quantities, price] 再輸入 DB
--Remark 4: Dummy data 的 price 直接取 products TABLE price
INSERT INTO order_items (user_id, order_id, product_id, quantities, price) VALUES 
    (5, 1, 1, 11, (SELECT price FROM products WHERE id = 1)),
    (5, 1, 2, 12, (SELECT price FROM products WHERE id = 2)),
    (5, 1, 3, 13, (SELECT price FROM products WHERE id = 3));
-- DELETE 
-- DELETE FROM cart WHERE user_id = (SELECT id FROM users WHERE username = 'Mary');