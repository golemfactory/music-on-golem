import { workTable } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cancelWork, runOnGolem } from "~/server/golem/runOnGolem";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) throw new Error("Not logged in");
    return ctx.db
      .select()
      .from(workTable)
      .where(eq(workTable.owner, ctx.user))
      .orderBy(workTable.createdAt);
  }),
  get: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not logged in");
      return ctx.db
        .select()
        .from(workTable)
        .where(eq(workTable.id, input.id))
        .where(eq(workTable.owner, ctx.user));
    }),
  create: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not logged in");
      try {
        const workId = await runOnGolem({
          prompt: input.prompt,
          owner: ctx.user,
        });
        return workId;
      } catch (e) {
        console.error(e);
        throw new Error("Failed to create work");
      }
    }),
  cancel: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not logged in");
      try {
        const [work] = await ctx.db
          .select()
          .from(workTable)
          .where(eq(workTable.id, input.id))
          .where(eq(workTable.owner, ctx.user))
          .limit(1);
        if (!work) throw new Error("Work not found");
        await cancelWork(input.id);
        return true;
      } catch (e) {
        console.error(e);
        throw new Error("Failed to cancel work");
      }
    }),
});
