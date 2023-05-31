import { Time } from "@blc-mono/core/time";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { isUser } from "@blc-mono/core/middleware/auth";
import { jwt } from "hono/jwt";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());
app.use(
  "*",
  jwt({
    secret: process.env.JWT_SECRET ?? "secret",
  })
);

app.get("/", (c) => c.text(`Hello world from identity ${Time.now()}}`));

export const handler = handle(app);
