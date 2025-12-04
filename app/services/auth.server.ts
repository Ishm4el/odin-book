import { Authenticator } from "remix-auth";
import { createCookieSessionStorage } from "react-router";
import { FormStrategy } from "remix-auth-form";
import { database } from "~/database/context";
import { eq } from "drizzle-orm";
import { users } from "~/database/schema";
import bcrypt from "bcryptjs";

export type User = {
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
    columns: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
    where: eq(users.email, email),
  });

  if (user) {
    console.log(user);
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Password");
    else
      return {
        email: user.email,
        firstName: user.firstName,
        id: user.id,
        lastName: user.lastName,
      };
  } else throw new Error("User is empty");
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
  "user-pass",
);
