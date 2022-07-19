import Web3 from 'web3';
import getRpcUrl from "./getRpcUrl";

export const useWeb3 = () => {
    console.log(getRpcUrl(), "yo ho rpc yr")
    return new Web3(
        Web3.givenProvider || new Web3.providers.HttpProvider(getRpcUrl())
    );
};
