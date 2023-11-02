import { eq } from "drizzle-orm";
import { db } from "../db";
import { workTable } from "../db/schema";
import { golem } from "./network";

export async function runOnGolem({
  prompt,
  owner,
}: {
  prompt: string;
  owner: string;
}) {
  const job = await golem.createJob<string>();

  job
    .startWork(
      async (ctx) => {
        await ctx.run(`python run.py --prompt "${prompt}" --duration 15`);
        await ctx.downloadFile("/golem/output/out.wav", `public/${job.id}.wav`);
        return `public/${job.id}.wav`;
      },
      {
        package: {
          imageTag: "severyn/musicgen:lite",
          minStorageGib: 8,
          minCpuCores: 4,
          minMemGib: 8,
        },
      },
    )
    .catch(console.error);

  await db.insert(workTable).values({
    id: job.id,
    status: "waiting",
    owner,
    prompt,
  });

  job.eventTarget.addEventListener("started", () => {
    db.update(workTable)
      .set({ status: "in_progress" })
      .where(eq(workTable.id, job.id))
      .catch(console.error);
  });
  job.eventTarget.addEventListener("success", () => {
    db.update(workTable)
      .set({ status: "done" })
      .where(eq(workTable.id, job.id))
      .catch(console.error);
  });
  job.eventTarget.addEventListener("error", () => {
    db.update(workTable)
      .set({ status: "error" })
      .where(eq(workTable.id, job.id))
      .catch(console.error);
  });
  return {
    id: job.id,
    status: "waiting",
    owner,
    prompt,
  };
}

export async function cancelWork(id: string) {
  const job = golem.getJobById(id);
  if (!job) {
    throw new Error("Job not found");
  }
  await job.cancel();
}
