import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User"; // <-- notice we import your interface

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        const identifier = credentials.identifier.trim();
        const password = credentials.password;

        // explicitly type the return
        const user = (await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }).exec()) as User | null;

        if (!user) throw new Error("No user found");
        if (!user.isVerified)
          throw new Error("Please verify your account before logging in");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) throw new Error("Incorrect password");

        // Now TypeScript knows `_id` exists and is valid
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.isVerified = (user as any).isVerified;
        token.isAcceptingMessages = (user as any).isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      const sUser = session.user as any;
      sUser.id = token.id;
      sUser.username = token.username;
      sUser.isVerified = token.isVerified;
      sUser.isAcceptingMessages = token.isAcceptingMessages;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/sign-in" },
};
