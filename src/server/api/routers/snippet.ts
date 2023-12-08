import { snippetTable } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cancelWork, startWork } from "~/server/golem/golemService";
import { TRPCError } from "@trpc/server";

export const snippetRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(snippetTable)
      .where(eq(snippetTable.owner, ctx.user))
      .orderBy(snippetTable.createdAt);
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input, ctx }) => {
      return ctx.db
        .select()
        .from(snippetTable)
        .where(eq(snippetTable.id, input.id))
        .where(eq(snippetTable.owner, ctx.user));
    }),
  create: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(({ input, ctx }) => {
      try {
        const createdJob = startWork({
          prompt: input.prompt,
          owner: ctx.user,
        });
        return createdJob;
      } catch (e) {
        throw new TRPCError({
          message: "Failed to start work on the Golem network",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const [snippet] = await ctx.db
          .select()
          .from(snippetTable)
          .where(eq(snippetTable.id, input.id))
          .where(eq(snippetTable.owner, ctx.user))
          .limit(1);
        if (!snippet) {
          throw new TRPCError({
            message: "Snippet not found",
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
