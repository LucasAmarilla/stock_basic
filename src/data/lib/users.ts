"use server";
import { and, count, eq, like, ne, notLike } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schemas/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "@solidjs/router";

function generateToken(id: number) {
  const secret = process.env.JWT_SECRET as string;
  const jwtToken = jwt.sign(
    {
      userId: id
    },
    secret,
    { expiresIn: "24h" }
  );
  return jwtToken
}


export const getLogin = async (username: string, password: string) => {
  const data = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  const user = data[0];
  if (!user) {
    throw new Error("Verifique las credenciales");
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new Error("Verifique las credenciales");
  }

  const jwtToken = generateToken(user.id)
  return jwtToken
};


export const getUsersList = query(
  async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ) => {
    "use server";

    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const offset = (currentPage - 1) * currentLimit;


    const whereClause =
      search.trim() !== ""
        ? and(
          like(usersTable.username, `%${search}%`),
          ne(usersTable.username, "admin")
        )
        : ne(usersTable.username, "admin");
    const data = await db
      .select({ username: usersTable.username, admin: usersTable.admin, id: usersTable.id })
      .from(usersTable)
      .where(whereClause)
      .limit(currentLimit)
      .offset(offset);

    // Conta o total de registros com o mesmo filtro
    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(usersTable)
      .where(whereClause);

    return {
      data,
      page: currentPage,
      limit: currentLimit,
      search,
      total,
      totalPages: Math.ceil(total / currentLimit),
    };
  },
  "getUsersList"
);

export const deleteUser = async (id: number) => {
  "use server"
  const [data] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
  return data
}