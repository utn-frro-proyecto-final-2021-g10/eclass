import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";
import { compare } from "../../../lib/bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (user?.password && credentials?.password) {
          const match = await compare(credentials.password, user.password);
          if (match) {
            const { id, firstName, lastName, email, role } = user;
            return {
              id,
              firstName,
              lastName,
              email,
              role,
            };
          } else {
            throw new Error("Invalid username or password");
          }
        }
        throw new Error("Invalid username or password");
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user;
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_AUTH_JWT_SECRET,
    //@ts-ignore-next-line
    encryption: true,
  },
  session: {
    //@ts-ignore-next-line
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
});
