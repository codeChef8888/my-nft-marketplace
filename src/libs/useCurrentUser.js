import { useAccount } from "wagmi";

export const useCurrentUser = () => {
    const { address, isConnected } = useAccount();
    const account = address;
    return { account, isConnected };
}