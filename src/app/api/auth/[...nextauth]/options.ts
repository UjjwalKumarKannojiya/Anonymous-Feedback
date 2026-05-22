import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: Record<string, string> | undefined): Promise<any> {
                await dbConnect()
                if (!credentials) {
                    throw new Error("Credentials are required");
                }
                try {
                    // Find user by email or username using case-insensitive search
                    const user = await UserModel.findOne({
                        $or: [
                            { email: { $regex: new RegExp(`^${credentials.identifier}$`, "i") } },
                            { username: { $regex: new RegExp(`^${credentials.identifier}$`, "i") } }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before logging in");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    
                    if (isPasswordCorrect) {
                        // Convert Mongoose document to plain object for NextAuth serialization
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessages,
                        };
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (err: unknown) {
                    const error = err as Error;
                    // Rethrow the specific error message for the client
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id || user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Priority 1: Relative URLs on the same server
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Priority 2: Absolute URLs on the same hostname (regardless of localhost or IP)
            else if (new URL(url).origin === baseUrl) return url
            // Default back to start
            return baseUrl
        },
    },
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    // THE CRITICAL FIX: Explicit HTTP-Only cookies for local network testing
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // Must be FALSE for HTTP local network access
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: false, // Must be FALSE for HTTP local network access
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // Must be FALSE for HTTP local network access
            },
        },
    },
};