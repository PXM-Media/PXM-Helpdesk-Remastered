export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } | any }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect to dashboard if trying to access login while logged in
                if (nextUrl.pathname.startsWith("/login")) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
            }
            return true;
        },
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.role = user.role;
                token.organizationId = user.organizationId;
            }
            return token;
        },
        session({ session, token }: { session: any; token: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role as "ADMIN" | "AGENT" | "END_USER";
                session.user.organizationId = token.organizationId;
            }
            return session;
        },
    },
    providers: [], // Added later in auth.ts
};
