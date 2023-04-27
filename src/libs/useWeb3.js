import Web3 from 'web3/dist/web3.min.js';
import getRpcUrl from "./getRpcUrl";

export const useWeb3 = () => {
    console.log(getRpcUrl(), "")
    return new Web3(
        Web3.givenProvider || new Web3.providers.HttpProvider(getRpcUrl())
    );
};
