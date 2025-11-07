// app/api/auth/[...nextauth]/options.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";

// Ensure required env present early (helpful for logs)
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET is not set — sessions may be insecure.");
}

// Helper: generate unique username from email base
async function generateUniqueUsername(base: string): Promise<string> {
  const clean = base.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14) || "user";
  let username = clean;
  let i = 0;
  while (await UserModel.exists({ username })) {
    i++;
    username = `${clean}${i}`;
    if (i > 1000) {
      username = `${clean}${randomBytes(3).toString("hex")}`;
      break;
    }
  }
  return username;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize should return the *user object* that will get stored on token/session.
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            // NextAuth will handle an error; returning null means authentication failed.
            return null;
          }

          // ensure DB is connected
          await dbConnect();

          const identifier = credentials.identifier.trim();
          const password = credentials.password;

          // find user by email or username
          const userDoc = (await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          }).lean()) as (User & { _id: any }) | null;

          if (!userDoc) {
            // return null to indicate failed sign-in (no user)
            return null;
          }

          if (!userDoc.isVerified) {
            // you can pass messages via error redirection; return null here
            return null;
          }

          const passwordMatches = await bcrypt.compare(password, userDoc.password);
          if (!passwordMatches) {
            return null;
          }

          // Build the public user object that will be available in callbacks
          const userForSession = {
            // NextAuth prefers `id` as a string
            id: userDoc._id.toString(),
            email: userDoc.email,
            username: userDoc.username,
            isVerified: Boolean(userDoc.isVerified),
            isAcceptingMessages: Boolean(userDoc.isAcceptingMessages),
          };

          return userForSession;
        } catch (err) {
          console.error("Error in CredentialsProvider.authorize:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Default scopes: openid, email, profile
    }),
  ],

  callbacks: {
    // Called whenever a JWT is created (initial sign in) or updated.
    async jwt({ token, user }) {
      // On first sign-in, `user` is present — copy useful fields to the token.
      if (user) {
        const u = user as any;
        token.id = u.id ?? token.id;
        token.username = u.username ?? token.username;
        token.isVerified = u.isVerified ?? token.isVerified;
        token.isAcceptingMessages = u.isAcceptingMessages ?? token.isAcceptingMessages;
      }
      return token;
    },

    // Called when session object is created (client or server getSession/getServerSession)
    async session({ session, token }) {
      // ensure session.user exists
      session.user = session.user || ({} as any);
      const sUser: any = session.user;

      // copy the properties from token into session.user so server APIs can read them
      if (token?.id) {
        sUser.id = token.id;
        sUser._id = token.id; // Add _id for backward compatibility
      }
      if (token?.username) sUser.username = token.username;
      if (typeof token?.isVerified !== "undefined") sUser.isVerified = token.isVerified;
      if (typeof token?.isAcceptingMessages !== "undefined")
        sUser.isAcceptingMessages = token.isAcceptingMessages;

      return session;
    },

    // Link/create DB user for OAuth sign-ins
    async signIn({ user, account, profile }) {
      try {
        // Only handle Google provider logic here
        if (account?.provider === "google") {
          await dbConnect();
          const providerEmail = (profile as any)?.email;
          const emailVerified = (profile as any)?.email_verified ?? false;
          const googleId = (profile as any)?.sub ?? (profile as any)?.id;

          if (!providerEmail) {
            console.warn("Google provider did not return an email — denying sign in.");
            return false;
          }

          // Require email to be verified by Google
          if (!emailVerified) {
            console.warn("Google email not verified — denying sign in.");
            return false;
          }

          // Find existing user by email
          let dbUser = await UserModel.findOne({ email: providerEmail });

          if (dbUser) {
            // Link Google account if not already linked
            if (!dbUser.googleId && googleId) {
              dbUser.googleId = googleId;
              dbUser.providers = dbUser.providers || [];
              if (!dbUser.providers.find((p: any) => p.name === "google")) {
                dbUser.providers.push({ name: "google", providerId: googleId });
              }
            }
            // Auto-verify if Google says email is verified
            if (emailVerified && !dbUser.isVerified) {
              dbUser.isVerified = true;
            }
            await dbUser.save();
          } else {
            // Create new user
            const base = providerEmail.split("@")[0];
            const username = await generateUniqueUsername(base);
            dbUser = await UserModel.create({
              username,
              email: providerEmail,
              isVerified: Boolean(emailVerified),
              isAcceptingMessages: true,
              googleId: googleId,
              providers: googleId ? [{ name: "google", providerId: googleId }] : [],
              // No password for OAuth users
            });
          }

          // Attach DB fields to the NextAuth 'user' object so jwt callback copies them
          (user as any).id = dbUser._id.toString();
          (user as any).username = dbUser.username;
          (user as any).isVerified = Boolean(dbUser.isVerified);
          (user as any).isAcceptingMessages = Boolean(dbUser.isAcceptingMessages);
        }
        return true;
      } catch (err) {
        console.error("Error in signIn callback for Google OAuth:", err);
        return false;
      }
    },
  },

  // We use JWT sessions (no DB session storage)
  session: {
    strategy: "jwt",
    // optional: you can set maxAge, updateAge here
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  // custom pages
  pages: {
    signIn: "/sign-in",
    // error: '/auth/error', // optional custom error page
  },

  // optional debug logging (enable if troubleshooting)
  // debug: process.env.NODE_ENV === 'development',
};
