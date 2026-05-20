"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schemas/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  const user = result[0];
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
