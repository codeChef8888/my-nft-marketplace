import { create as ipfsHttpClient } from "ipfs-http-client";
import { useMarketPlace } from "./useContract";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const uploadToIPFS = async (payload) => {
  // event.preventDefault();
  const file = payload;
  if (typeof file !== "undefined") {
    try {
      const result = await client.add(file); // IPFS client
      console.log(result, "yo ho reults");
      return result.path;
    } catch (error) {
      console.log("ipfs upload error: ", error);
    }
  }
};

export const createNFT721 = async (
  image,
  price,
  name,
  description,
  account
) => {
  if (!image || !price || !name || !description) return;
  try {
    const { mintThenList721 } = useMarketPlace();
    //Upload all of the metadata to IPFS
    const result = await client.add(
      JSON.stringify({ image, price, name, description })
    ); //Adding metadata in JSON with Object containing metadata.
    console.log([result], "yei ho resuslt");
    //Mint NFT and Auction it in Marketplace.
    mintThenList721(result, price, account);
  } catch (error) {
    console.log("ipfs uri upload error: ", error);
  }
};
