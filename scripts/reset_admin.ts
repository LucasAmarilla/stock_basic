import bcrypt from "bcrypt";
import { db } from "~/data/db";
import { usersTable } from "~/data/db/schemas/users";
import "dotenv/config";
import { eq } from "drizzle-orm";

async function main() {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
    console.log(process.env.ADMIN_PASSWORD!)
    const [user] = await db
        .update(usersTable)
        .set({
            password: hash,

        }).where(eq(usersTable.username, "admin"))
        .returning();
    console.log(user)

}

main();
