import { TRPCError } from "@trpc/server";
import { sign } from "jsonwebtoken";
import { SiweMessage, generateNonce } from "siwe";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  nonce: publicProcedure.mutation(() => {
    return {
      nonce: generateNonce(),
    };
  }),
  login: publicProcedure
    .input(z.object({ message: z.string(), signature: z.string() }))
    .mutation(async ({ input }) => {
      const siweMessage = new SiweMessage(input.message);
      const fields = await siweMessage.verify({ signature: input.signature });
      if (!fields.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid signature",
        });
      const jwt = sign(fields.data.address, env.JWT_SECRET);
      return {
        jwt,
      };
    }),
});
