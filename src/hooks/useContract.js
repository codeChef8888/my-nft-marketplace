import { getNFTAddress, getNFT1155Address, getMarketPlaceAddress } from "../libs/addressHelper";
import { useWeb3 } from "../libs/useWeb3";
import NFT from "../contracts/abis/NFT.json";
import NFT1155 from "../contracts/abis/NFT1155.json";
import Marketplace from "../contracts/abis/Marketplace.json";



const useContract = (abiArtifact, address) => {
    const web3 = useWeb3();
    return new web3.eth.Contract(abiArtifact, address);
};

export const useNFT = () => {
    return useContract(NFT, getNFTAddress());
};

export const useNFT1155 = () => {
    return useContract(NFT1155, getNFT1155Address());
};

export const useMarketPlace = () => {
    return useContract(Marketplace, getMarketPlaceAddress());
};

export default useContract;
