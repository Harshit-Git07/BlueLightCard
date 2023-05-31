import { Time } from "@blc-mono/core/time";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import { Type as T } from "@sinclair/typebox";

const schema = T.Object({
  firstname: T.String(),
  age: T.Number(),
});

const app = new Hono();

app.use("*", cors());
app.use("*", logger());
app.use(
  "*",
  jwt({
    secret: process.env.JWT_SECRET ?? "secret",
  })
);

app.post("/", (c, next) => {
  return c.json({ success: true });
});
app.get("/", (c) => c.text(`Hello world from identity ${Time.now()}}`));

export const handler = handle(app);
