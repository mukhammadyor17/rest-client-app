import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseServerClient } from "./supabaseServerClient";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user, error } = await supabaseServerClient
          .from("users")
          .select("id, email, password_hash")
          .eq("email", credentials.email)
          .single();

        if (error || !user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 300,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.email) {
        token.id = (user as any).id;
        token.email = user.email;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any) = {
        id: (token as any).id,
        email: token.email,
        role: (token as any).role,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
