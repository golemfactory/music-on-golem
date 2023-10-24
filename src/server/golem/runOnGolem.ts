import { eq } from "drizzle-orm";
import { db } from "../db";
import { workTable } from "../db/schema";
import { golem } from "./network";
import { type BaseEvent, EventType } from "@golem-sdk/golem-js";

export async function runOnGolem({
  prompt,
  owner,
}: {
  prompt: string;
  owner: string;
}) {
  const workOnGolem = await golem.startTask(
    async (ctx) => {
      await ctx.run(`python`, [
        "run.py",
        "--prompt",
        prompt,
        "--duration",
        "15",
      ]);
      await ctx.downloadFile(
        "/golem/output/out.wav",
        `public/${ctx.workId}.wav`,
      );
      return `public/${ctx.workId}.wav`;
    },
    {
      image: "severyn/musicgen:lite",
      minStorageGib: 8,
      minCpuCores: 4,
      minMemGib: 8,
    },
  );

  await db.insert(workTable).values({
    id: workOnGolem.id,
    status: "waiting",
    owner,
    prompt,
  });

  workOnGolem.eventTarget.addEventListener(EventType, (event: Event) => {
    console.log((event as BaseEvent<unknown>).name);
    switch ((event as BaseEvent<unknown>).name) {
      case "TaskStarted":
        db.update(workTable)
          .set({ status: "in_progress" })
          .where(eq(workTable.id, workOnGolem.id))
          .catch(console.error);
        break;
      case "TaskFinished":
        db.update(workTable)
          .set({ status: "done" })
          .where(eq(workTable.id, workOnGolem.id))
          .catch(console.error);
        break;
      case "TaskRejected":
        db.update(workTable)
          .set({ status: "error" })
          .where(eq(workTable.id, workOnGolem.id))
          .catch(console.error);
        break;
    }
  });

  return {
    id: workOnGolem.id,
    status: "waiting",
    owner,
    prompt,
  };
}

export async function cancelWork(id: string) {
  return golem.stopTask(id);
}
