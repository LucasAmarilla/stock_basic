import { query } from "@solidjs/router";
import { count, eq, like } from "drizzle-orm";
import { db } from "..";
import { supplierTable } from "./products";

export const getSupplierList = query(
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
                ? like(supplierTable.name, `%${search}%`)
                : undefined;

        const data = await db
            .select()
            .from(supplierTable)
            .limit(currentLimit)
            .offset(offset).where(whereClause);

        // Conta o total de registros com o mesmo filtro
        const [{ total }] = await db
            .select({
                total: count(),
            })
            .from(supplierTable)
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
    "getSupplierList"
);

export const getSupplierById = async (id: number) => {
    "use server";

    const data = await db
        .select()
        .from(supplierTable)
        .where(eq(supplierTable.id, id))

    return data
}

export const addSupplier = async (name: string, phoneNumber: number) => {
    "use server"
    const [data] = await db.insert(supplierTable).values({ name: name, phoneNumber: phoneNumber }).returning();
    return data
}

export const deleteSupplier = async (id: number) => {
    "use server"
    const [data] = await db.delete(supplierTable).where(eq(supplierTable.id, id)).returning();
    return data
}

export const updateSupplier = async (id: number, name: string, phoneNumber: number) => {
    "use server"
    const [data] = await db.update(supplierTable).set({ name: name, phoneNumber: phoneNumber }).where(eq(supplierTable.id, id)).returning();
    return data
}