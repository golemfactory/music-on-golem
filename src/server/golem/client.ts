import { JobManager } from "@golem-sdk/golem-js/experimental";
import { env } from "~/env.mjs";


async function getJobManager() {
  const jobManager = new JobManager({
    yagna: {
      apiKey: env.YAGNA_APPKEY,
    },
    payment: {
      network: env.NETWORK,
    },
  });
  await jobManager.init().then(
    () => console.log("Golem client initialized"),
    (err) => console.error("Golem client failed to initialize", err),
  );
  return jobManager;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  let jobManager: JobManager | undefined;
}

/**
 * We want to initialize the Golem Job Manager once and then reuse it across the server.
 */
async function getManager() {
  if (globalThis.jobManager) {
    return globalThis.jobManager;
  }
  globalThis.jobManager = await getJobManager();
  return globalThis.jobManager;
}

const jobManager = await getManager();
export { jobManager };
