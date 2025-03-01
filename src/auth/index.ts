import { env } from "@/env";
import NextAuth, { type User, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const BASE_PATH = "/api/auth";

const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      authorize: async (credentials): Promise<User | null> => {
        const { password, username } = credentialsSchema.parse(credentials);

        if (
          username === env.ADMIN_USERNAME &&
          password === env.ADMIN_PASSWORD
        ) {
          return Promise.resolve({
            id: "1",
            name: username,
          });
        }

        return Promise.resolve(null);
      },
    }),
  ],
  basePath: BASE_PATH,
  secret: env.AUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
