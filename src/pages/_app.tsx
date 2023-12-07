import type { AppType } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { api, atomStore } from "~/utils/api";
import "@fontsource/kanit/400.css"; // regular
import "@fontsource/kanit/600.css"; // semi-bold
import "~/styles/globals.css";
import { polygon } from "viem/chains";
import { Provider } from "jotai";
import RootLayout from "~/features/layout/components/RootLayout";
import { Toaster } from "~/design-system/components/ui/toaster";

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
        <RootLayout>
          <Component {...pageProps} />
          <Toaster />
        </RootLayout>
      </WagmiConfig>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
