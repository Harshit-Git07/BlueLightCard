import { Context, Env, Next } from "hono";

export const isAdmin = async (c: Context<Env, "*", {}>, next: Next) => {};

export const isUser = async (c: Context<Env, "*", {}>, next: Next) => {
  if (c.req.headers["authorization"]) {
    return next();
  }
  return c.json({ error: "Unauthorized" }, 401);
};
