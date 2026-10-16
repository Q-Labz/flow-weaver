import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { readEnv } from "@/lib/env";

function createAuth() {
  return betterAuth({
    secret: readEnv("BETTER_AUTH_SECRET"),
    baseURL: readEnv("BETTER_AUTH_URL"),
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [tanstackStartCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;

let _auth: Auth | undefined;

export function getAuth(): Auth {
  if (!_auth) _auth = createAuth();
  return _auth;
}

/** Lazy so importing the router / Site Guide does not require a database URL. */
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    return Reflect.get(getAuth(), prop, receiver);
  },
});
