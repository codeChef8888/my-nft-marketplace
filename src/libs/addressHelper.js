import addresses from "../contracts/constants/contractsAddress";

const chainId = process.env.REACT_APP_CHAIN_ID;
console.log(chainId, "This is the Chain Id");

export const getNFTAddress = () => {
    return addresses.nft[chainId];
};

export const getNFT1155Address = () => {
    return addresses.nft1155[chainId];
};

export const getMarketPlaceAddress = () => {
    return addresses.marketPlace[chainId];
};