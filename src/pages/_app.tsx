import type { AppType } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { api, atomStore } from "~/utils/api";
import "~/styles/globals.css";
import { polygon } from "viem/chains";
import { Provider } from "jotai";

const config = createConfig({
  autoConnect: false,
  publicClient: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={atomStore}>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
