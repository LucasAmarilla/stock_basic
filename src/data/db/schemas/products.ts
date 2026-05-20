import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const supplierTable = sqliteTable("supplier_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phoneNumber: int(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const debtsTable = sqliteTable("debts_table", {
  id: int().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  value: real().notNull(),
  paidValue: real().notNull().default(0),
  done: integer({ mode: "boolean" }),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplierTable.id, {
      onDelete: "cascade",
    }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const productsTable = sqliteTable("products_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity"),
  paidPrice: real("paid_price").notNull(),

  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplierTable.id, {
      onDelete: "cascade",
    }),

  createdAt: text("created_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),

  updatedAt: text("updated_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),
});
