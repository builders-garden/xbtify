import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { http } from "viem";
import { basePreconf, baseSepoliaPreconf, mainnet } from "viem/chains";
import { createConfig } from "wagmi";

// Create wagmi config for farcaster miniapp
export const wagmiConfigMiniApp = createConfig({
  ssr: undefined,
  chains: [mainnet, basePreconf, baseSepoliaPreconf],
  transports: {
    [mainnet.id]: http(),
    [basePreconf.id]: http(),
    [baseSepoliaPreconf.id]: http(),
  },
  connectors: [miniAppConnector()],
});
