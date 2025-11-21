import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { USER_API_URL } from "@/services/api.service";

interface Credentials {
  email?: string | undefined;
  password?: string | undefined;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials as Record<"email", string> &
          Record<"password", string>;

        // Admin login
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "0",
            email: process.env.ADMIN_EMAIL,
            name: "Admin",
            role: "admin",
          };
        }

        // Regular user login
        try {
          const userResponse = await fetch(
            `${USER_API_URL}/users?email=${email}`
          );
          const users = await userResponse.json();
          const user = users[0];

          if (
            user &&
            user.password &&
            (await bcrypt.compare(password as string, user.password))
          ) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.fullName,
              role: user.role || "user",
            };
          }
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
