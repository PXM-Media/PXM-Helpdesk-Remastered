import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@repo/database";
import bcrypt from "bcryptjs";

async function getUser(email: string) {
    try {
        return await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
        });
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(1) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // Check if password exists (it might be null for social logins later, but here it's required)
                    if (!user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});
