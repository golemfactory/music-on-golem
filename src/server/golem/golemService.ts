import { eq } from "drizzle-orm";
import { db } from "../db";
import { snippetTable } from "../db/schema";
import { golemClient } from "./network";

export function startWork({
  prompt,
  owner,
}: {
  prompt: string;
  owner: string;
}) {
  const job = golemClient.createJob<string>({
    package: {
      imageTag: "severyn/musicgen:lite",
      minStorageGib: 8,
      minCpuCores: 4,
      minMemGib: 8,
    },
  });

  job.events.on("created", () => {
    console.log("Job", job.id, "created");
    db.insert(snippetTable)
      .values({
        id: job.id,
        status: "waiting",
        owner,
        prompt,
      })
      .catch(console.error);
  });
  job.events.on("started", () => {
    console.log("Job", job.id, "started");
    db.update(snippetTable)
      .set({ status: "in_progress" })
      .where(eq(snippetTable.id, job.id))
      .catch(console.error);
  });
  job.events.on("success", () => {
    console.log("Job", job.id, "success", job.results);
    db.update(snippetTable)
      .set({ status: "done" })
      .where(eq(snippetTable.id, job.id))
      .catch(console.error);
  });
  job.events.on("error", () => {
    console.log("Job", job.id, "error", job.error);
    db.update(snippetTable)
      .set({ status: "error" })
      .where(eq(snippetTable.id, job.id))
      .catch(console.error);
  });

  job.startWork(async (ctx) => {
    await ctx.run(`python run.py --prompt "${prompt}" --duration 15`);
    await ctx.downloadFile("/golem/output/out.wav", `public/${job.id}.wav`);
    return `public/${job.id}.wav`;
  });

  return {
    id: job.id,
    status: "waiting",
    owner,
    prompt,
  };
}

export async function cancelWork(id: string) {
  const job = golemClient.getJobById(id);
  if (!job) {
    throw new Error("Job not found");
  }
  await job.cancel();
}
