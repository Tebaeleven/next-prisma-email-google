import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        // メールアドレス認証
        CredentialsProvider({
            name: "credentials",
            credentials: {
                // メールアドレスとパスワード
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                // メールアドレスとパスワードがない場合はエラー
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("メールアドレス,パスワードが存在しません");
                }
                // ユーザーを取得
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                // ユーザーが存在しない場合はエラー
                if (!user || !user?.hashedPassword) {
                    throw new Error("ユーザーが存在しません");
                }

                // パスワードが一致しない場合はエラー
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                
                //一致したらtrue=実行されない
                if (!isCorrectPassword) {
                    throw new Error("パスワードが一致しません");
                }

                return user;
            },
        }), 
    ],
    session:{
        strategy:"jwt",
    },
    secret:process.env.SECRET, //秘密鍵
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }