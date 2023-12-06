import { workTable } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cancelWork, runOnGolem } from "~/server/golem/golemService";
import { TRPCError } from "@trpc/server";

export const workRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(workTable)
      .where(eq(workTable.owner, ctx.user))
      .orderBy(workTable.createdAt);
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input, ctx }) => {
      return ctx.db
        .select()
        .from(workTable)
        .where(eq(workTable.id, input.id))
        .where(eq(workTable.owner, ctx.user));
    }),
  create: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(({ input, ctx }) => {
      try {
        const work = runOnGolem({
          prompt: input.prompt,
          owner: ctx.user,
        });
        return work;
      } catch (e) {
        throw new TRPCError({
          message: "Failed to create work",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const [work] = await ctx.db
          .select()
          .from(workTable)
          .where(eq(workTable.id, input.id))
          .where(eq(workTable.owner, ctx.user))
          .limit(1);
        if (!work) {
          throw new TRPCError({
            message: "Work not found",
            code: "NOT_FOUND",
          });
        }
        await cancelWork(input.id);
        return true;
      } catch (e) {
        throw new TRPCError({
          message: "Failed to cancel work",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
