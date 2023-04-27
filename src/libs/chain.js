import { node } from "./getRpcUrl";

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
const BASE_ETH_SCAN_URL = process.env.REACT_APP_ETHER_SCAN;

export const ropstenChain = {
    id: chainId,
    name: "Ropsten Smart Test Chain",
    network: "ropsten",
    nativeCurrency: {
        name: "RETH",
        symbol: "eth",
        decimals: 18,
    },
    rpcUrls: {
        default: node,
    },
    blockExplorers: {
        default: { name: "Bsc Scan", url: BASE_ETH_SCAN_URL },
    },
    testnet: true,
};
