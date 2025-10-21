import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;

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
            `http://localhost:3001/users?email=${email}`
          );
          const users = await userResponse.json();
          const user = users[0];

          if (user && (await bcrypt.compare(password, user.password))) {
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
        // @ts-expect-error Role is added to token
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error ID is added to session user
        session.user.id = token.id;
        // @ts-expect-error Role is added to session user
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
