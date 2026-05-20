import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  admin: integer({ mode: "boolean" }).default(false),
});
