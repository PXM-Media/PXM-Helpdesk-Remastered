"use server";

import { signIn } from "@/../auth";
import { AuthError } from "next-auth";
import { db } from "@repo/database";
import { users, passwordResetTokens } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/sender";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            console.log("AuthError caught:", error.type, error.message);
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        console.log("Non-AuthError caught:", error);
        throw error;
    }
}

export async function requestPasswordReset(email: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user || !user.organizationId) {
            // Return success to prevent email enumeration
            return { success: true, message: "If an account exists, a reset link has been sent." };
        }

        const token = uuidv4();
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Clear existing tokens for this email
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.identifier, email));

        await db.insert(passwordResetTokens).values({
            identifier: email,
            token,
            expires,
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

        const html = `
            <p>You requested a password reset.</p>
            <p>Click the link below to verify your email and set a new password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 1 hour.</p>
        `;

        await sendEmail(user.organizationId, email, "Password Reset Request", html);

        return { success: true, message: "If an account exists, a reset link has been sent." };

    } catch (error) {
        console.error("Reset request error:", error);
        return { success: false, error: "Failed to process request" };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const resetRecord = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token),
        });

        if (!resetRecord) {
            return { success: false, error: "Invalid or expired token" };
        }

        if (new Date() > resetRecord.expires) {
            await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
            return { success: false, error: "Token expired" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.email, resetRecord.identifier));

        // Delete token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

        return { success: true };

    } catch (error) {
        console.error("Password reset error:", error);
        return { success: false, error: "Failed to reset password" };
    }
}
