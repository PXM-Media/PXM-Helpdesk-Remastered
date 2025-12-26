import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: "ADMIN" | "AGENT" | "END_USER"
        } & DefaultSession["user"]
    }

    interface User {
        role: "ADMIN" | "AGENT" | "END_USER"
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        role?: "ADMIN" | "AGENT" | "END_USER"
    }
}
