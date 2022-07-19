import '@rainbow-me/rainbowkit/dist/index.css';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { InjectedConnector } from "wagmi/connectors/injected";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import getRpcUrl from "./getRpcUrl";


const rpcUrl = getRpcUrl();
const infuraId = process.env.REACT_APP_INFURA_ID;

export const { chains, provider } = configureChains(
    [chain.ropsten, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [
        jsonRpcProvider({
            priority: 0,
            rpc: () => ({
                http: `${rpcUrl}`,
            }),
            pollingInterval: 5000,
            stallTimeout: 1000,
        }),
        infuraProvider({
            infuraId,
            priority: 1,
            pollingInterval: 5000,
            stallTimeout: 1000,
        }),
    ]
);

export const { connectors } = getDefaultWallets({
    appName: "my-nft-dapp",
    chains,
});

export const wagmiClient = createClient({
    autoConnect: true,
    // connectors: [metaMaskConnector, walletConnectConnector],
    connectors,
    provider,
});
