import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password" },
                email: { label: "Email", type: "email", placeholder: "Email" },
            },
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                if (!passwordMatch) {
                    return null;
                }

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };