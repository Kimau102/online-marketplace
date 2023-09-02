CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NULL,
    "password" VARCHAR(255) NOT NULL,
    "telephone" TEXT NULL,
    "address" TEXT NULL,
    "admin_auth" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE "products"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NULL,
    "image" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE "cart"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    "product_id" INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    "quantities" INTEGER NOT NULL,
    "status" BOOLEAN NULL DEFAULT true,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
-- 20230817 Update: Set 埋 cart status DEFAULT true
ALTER TABLE cart ALTER COLUMN status SET DEFAULT true;

-- create sequence serial for invoice number
CREATE SEQUENCE invoice_no START 1000;
-- Can get the number by below sql command:
-- SELECT nextval('invoice_no');
CREATE TABLE "order_info"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "invoice_no" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    "address" VARCHAR(255) NOT NULL,
    "remark" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "total_amount" DECIMAL(8, 2) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
-- 20230821 Update: ADD COLUMN telephone for order_info
ALTER TABLE order_info ADD COLUMN telephone VARCHAR(255);

CREATE TABLE "order_items"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    "order_id" INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES order_info(id),
    "product_id" INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    "quantities" INTEGER NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "status" BOOLEAN NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "users_favourite"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    "product_id" INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);