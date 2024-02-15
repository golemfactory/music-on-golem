import { GolemNetwork } from "@golem-sdk/golem-js";
import { env } from "~/env.mjs";

async function getGolemClient() {
  const client = new GolemNetwork({
    yagna: {
      apiKey: env.YAGNA_APPKEY,
    },
    activity: {
      activityExecuteTimeout: 1000 * 60 * 60,
    },
    work: {
      activityPreparingTimeout: 1000 * 60 * 5,
    },
    payment: {
      payment: {
        network: env.NETWORK,
      },
    },
  });
  await client.init().then(
    () => console.log("Golem client initialized"),
    (err) => console.error("Golem client failed to initialize", err),
  );
  return client;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  let golemClient: GolemNetwork | undefined;
}

/**
 * We want to initialize the Golem client once and then reuse it across the server.
 */
async function getClient() {
  if (globalThis.golemClient) {
    return globalThis.golemClient;
  }
  globalThis.golemClient = await getGolemClient();
  return globalThis.golemClient;
}

const golemClient = await getClient();
export { golemClient };
