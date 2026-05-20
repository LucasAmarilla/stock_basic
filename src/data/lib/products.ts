import { query } from "@solidjs/router";
import { count, eq, like } from "drizzle-orm";
import { db } from "../db";
import { productsTable, supplierTable } from "../db/schemas/products";

export const getProductsList = query(
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
                ? like(productsTable.name, `%${search}%`)
                : undefined;

        const data = await db
            .select()
            .from(productsTable)
            .where(whereClause).leftJoin(supplierTable, eq(productsTable.supplierId, supplierTable.id))
            .limit(currentLimit)
            .offset(offset);

        // Conta o total de registros com o mesmo filtro
        const [{ total }] = await db
            .select({
                total: count(),
            })
            .from(productsTable)
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
    "getProducts"
);

export const getSupplierName = query(
    async () => {
        "use server";

        const data = await db
            .select()
            .from(supplierTable)

        return data
    },
    "getSupplierName"
);

export const getProductById = async (id: number) => {
    "use server";

    const data = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id))

    return data
}

export const addProduct = async (name: string, price: number, paid_price: number, supplierid: number, quantity: number) => {
    "use server"
    const [savedProduct] = await db.insert(productsTable).values({ name: name, paidPrice: paid_price, price: price, supplierId: supplierid, quantity: quantity }).returning();
    return savedProduct
}

export const deleteProduct = async (id: number) => {
    "use server"
    const [deletedProduct] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    return deletedProduct
}

export const updateProduct = async (id: number, name: string, price: number, paid_price: number, supplierid: number, quantity: number) => {
    "use server"
    const [updatedProduct] = await db.update(productsTable).set({ name: name, paidPrice: paid_price, price: price, supplierId: supplierid, quantity: quantity }).where(eq(productsTable.id, id)).returning();
    return updatedProduct
}