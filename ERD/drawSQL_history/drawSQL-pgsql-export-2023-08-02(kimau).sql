CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "telephone" TEXT NULL,
    "admin_authorization" BOOLEAN NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "products"(
    "id" INTEGER NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "storage" INTEGER NOT NULL,
    "ordered_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "products" ADD PRIMARY KEY("id");
CREATE TABLE "cart"(
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "ordered" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "cart" ADD PRIMARY KEY("id");
CREATE TABLE "users_favourite"(
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users_favourite" ADD PRIMARY KEY("id");
CREATE TABLE "order"(
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantities" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "order" ADD PRIMARY KEY("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "users_favourite" ADD CONSTRAINT "users_favourite_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "products" ADD CONSTRAINT "products_ordered_by_foreign" FOREIGN KEY("ordered_by") REFERENCES "users"("id");
ALTER TABLE
    "users_favourite" ADD CONSTRAINT "users_favourite_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");