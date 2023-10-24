import {
  GolemNetwork,
  MarketHelpers,
  ProposalFilters,
} from "@golem-sdk/golem-js";
import { env } from "~/env.mjs";

const acceptablePrice = ProposalFilters.limitPriceFilter({
  start: 1,
  cpuPerSec: 1 / 3600,
  envPerSec: 1 / 3600,
});

// Collect the whitelist
const verifiedProviders = (
  await MarketHelpers.getHealthyProvidersWhiteList()
).filter((p) => p !== "0x7275a62bb03271bf0c303704ad1da5618d971ad2");

// Prepare the whitelist filter
const whiteList = ProposalFilters.whiteListProposalIdsFilter(verifiedProviders);

const golem = new GolemNetwork({
  yagnaOptions: {
    apiKey: env.YAGNA_APPKEY,
  },
  taskTimeout: 1000 * 60 * 60,
  activityExecuteTimeout: 1000 * 60 * 60,
  activityPreparingTimeout: 1000 * 60 * 2,
  proposalFilter: async (proposal) =>
    (await acceptablePrice(proposal)) && (await whiteList(proposal)),
  payment: {
    network: "polygon",
  },
  enableLogging: false,
});

export { golem };
