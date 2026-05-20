import bcrypt from "bcrypt";
import { db } from "~/data/db";
import { usersTable } from "~/data/db/schemas/users";
import "dotenv/config";

async function main() {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
    console.log(process.env.ADMIN_PASSWORD!)
    const [user] = await db
        .insert(usersTable)
        .values({
            username: "admin",
            password: hash,
            admin: true
        })
        .returning();
    console.log(user)

}

main();
