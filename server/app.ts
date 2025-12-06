import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/postgres-js";
import express from "express";
import path from "path";
import postgres from "postgres";
import "react-router";
import { fileURLToPath } from "url";

import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

app.use(
  "/profileImages",
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "profileImages")
  )
);

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});
const db = drizzle(client, { schema });
app.use((_, __, next) => DatabaseContext.run(db, next));

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  })
);
