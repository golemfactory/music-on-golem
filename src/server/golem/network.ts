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

let golemClient: GolemNetwork;
/**
 * During development, we want to close the client when the dev server restarts,
 * so let's store it in the global object.
 * https://github.com/vercel/next.js/discussions/26427
 */
if (process.env.NODE_ENV === "development") {
  if (globalThis.golemClient) {
    console.log("Closing existing Golem client");
    await globalThis.golemClient.close().catch(console.error);
  }
  globalThis.golemClient = await getGolemClient();
  golemClient = globalThis.golemClient;
} else {
  // in production, we don't need to persist the client
  golemClient = await getGolemClient();
}

export { golemClient };
