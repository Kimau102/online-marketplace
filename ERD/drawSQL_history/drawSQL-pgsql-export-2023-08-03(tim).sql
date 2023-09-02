CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NULL, /* Tim: 部分 user details 如 email, tel, address, 我 set 返可以 null, 方便 INSERT user */
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
    "ordered_by" INTEGER NULL, /* Tim 問: 這個 ordered 用途是甚麼? btw 我先改了為 NULL */
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE "cart"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantities" INTEGER NOT NULL DEFAULT 1,  /* Tim: qty 我 SET DEFAULT VALUE 1, 但不肯定這做法 */    
    "ordered" BOOLEAN NOT NULL, /* Tim 問: 這個 ordered 用途是甚麼? */
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE "users_favourite"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE "order"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantities" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "order" ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "users_favourite" ADD CONSTRAINT "users_favourite_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "users_favourite" ADD CONSTRAINT "users_favourite_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");