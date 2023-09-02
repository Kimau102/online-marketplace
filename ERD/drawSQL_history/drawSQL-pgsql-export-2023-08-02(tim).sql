CREATE TABLE "cart"(
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "product_1_id" INTEGER NULL,
    "product_1_qty" INTEGER NULL,
    "product_2_id" INTEGER NULL,
    "product_2_qty" INTEGER NULL,
    "product_3_id" INTEGER NULL,
    "product_3_qty" INTEGER NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "cart" ADD PRIMARY KEY("id");
CREATE TABLE "customer"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" TEXT NULL DEFAULT 'HK',
    "tel" INTEGER NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "customer" ADD PRIMARY KEY("id");
CREATE TABLE "order"(
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "product_1_id" INTEGER NOT NULL,
    "product_1_qty" INTEGER NOT NULL,
    "product_2_id" INTEGER NULL,
    "product_2_qty" INTEGER NULL,
    "product_3_id" INTEGER NULL,
    "product_3_qty" INTEGER NULL,
    "status" CHAR(255) NOT NULL DEFAULT '' NEW pending ORDER '',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "order" ADD PRIMARY KEY("id");
CREATE TABLE "admin"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "admin" ADD PRIMARY KEY("id");
CREATE TABLE "product"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL DEFAULT 'Others',
    "description" TEXT NULL DEFAULT 'Updating description',
    "cost" DECIMAL(8, 2) NOT NULL DEFAULT '99999',
    "price" DECIMAL(8, 2) NOT NULL DEFAULT 'cost*1.5',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "product" ADD PRIMARY KEY("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_product_2_id_foreign" FOREIGN KEY("product_2_id") REFERENCES "product"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_1_id_foreign" FOREIGN KEY("product_1_id") REFERENCES "product"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_2_id_foreign" FOREIGN KEY("product_2_id") REFERENCES "product"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_3_id_foreign" FOREIGN KEY("product_3_id") REFERENCES "product"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_customer_id_foreign" FOREIGN KEY("customer_id") REFERENCES "customer"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_product_3_id_foreign" FOREIGN KEY("product_3_id") REFERENCES "product"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_product_1_id_foreign" FOREIGN KEY("product_1_id") REFERENCES "product"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_customer_id_foreign" FOREIGN KEY("customer_id") REFERENCES "customer"("id");