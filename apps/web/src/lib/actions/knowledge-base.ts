"use server";

import { db } from "@repo/database";
import { categories, articles } from "@repo/database/schema";
import { eq, desc, asc, and } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------
// Categories
// ----------------------------------------------------------------------

export async function getCategories() {
    try {
        const allCategories = await db.query.categories.findMany({
            orderBy: (categories, { asc }) => [asc(categories.order), asc(categories.name)],
            with: {
                articles: true // Count or list
            }
        });
        return { success: true, data: allCategories };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}

export async function createCategory(data: { name: string; slug: string; description?: string; icon?: string; order?: number }) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await db.insert(categories).values(data);
        revalidatePath("/dashboard/knowledge-base");
        revalidatePath("/portal/articles");
        return { success: true };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

// ----------------------------------------------------------------------
// Articles
// ----------------------------------------------------------------------

export async function getArticles(categoryId?: number) {
    try {
        const whereClause = categoryId ? eq(articles.categoryId, categoryId) : undefined;

        const allArticles = await db.query.articles.findMany({
            where: whereClause,
            orderBy: (articles, { desc }) => [desc(articles.createdAt)],
            with: {
                category: true,
                author: true,
            }
        });
        return { success: true, data: allArticles };
    } catch (error) {
        console.error("Failed to fetch articles:", error);
        return { success: false, error: "Failed to fetch articles" };
    }
}

export async function getArticleBySlug(slug: string) {
    try {
        const article = await db.query.articles.findFirst({
            where: eq(articles.slug, slug),
            with: {
                category: true,
                author: true,
            }
        });

        if (!article) return { success: false, error: "Article not found" };

        // Increment views (fire and forget)
        // db.update(articles).set({ views: article.views + 1 }).where(eq(articles.id, article.id)).execute();

        return { success: true, data: article };
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return { success: false, error: "Failed to fetch article" };
    }
}

export async function createArticle(data: { title: string; slug: string; categoryId: number; excerpt?: string; content: string; status: "DRAFT" | "PUBLISHED" }) {
    try {
        const session = await auth();
        if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
            return { success: false, error: "Unauthorized" };
        }

        await db.insert(articles).values({
            ...data,
            authorId: session.user.id
        });

        revalidatePath("/dashboard/knowledge-base");
        revalidatePath("/portal/articles");
        return { success: true };
    } catch (error) {
        console.error("Failed to create article:", error);
        return { success: false, error: "Failed to create article" };
    }
}
