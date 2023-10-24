import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { verify } from "jsonwebtoken";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

export function createContext({ req }: CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you might want to do in your ctx fn
  function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) return null;
      try {
        const address = verify(token, env.JWT_SECRET) as string;
        return address;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  const user = getUserFromHeader();

  return {
    user,
    db,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
