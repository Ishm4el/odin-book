import { Authenticator } from "remix-auth";
import { createCookieSessionStorage } from "react-router";
import { FormStrategy } from "remix-auth-form";
import { database } from "~/database/context";
import { eq } from "drizzle-orm";
import { users } from "~/database/schema";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["SomethingOnlyIKnow"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<User>();

async function login(email: string, password: string): Promise<User> {
  const db = database();
  const user = await db.query.users.findFirst({
    columns: { id: true, email: true, firstName: true, lastName: true },
    where: eq(users.email, email),
  });

  if (user) return user;
  else throw new Error("User is empty");
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    return await login(email, password);
  }),
  "user-pass"
);
