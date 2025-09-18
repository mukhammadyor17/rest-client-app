import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth/src";
import { supabaseServerClient } from "../../../../lib/supabaseServerClient.ts";
import { MyToken } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user, error } = await supabaseServerClient
          .from("users")
          .select("id, email, password_hash")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          console.error("User not found:", error?.message);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: "user",
        } as NextAuthUser & { role: string };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as NextAuthUser & { role: string }).role;
      }
      return token;
    },

    async session({ session, token }) {
      const t = token as unknown as MyToken;
      const s = session as unknown as Session;

      s.user = {
        id: t.id,
        email: t.email,
        role: t.role,
      };
      return s as Session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
