import { getNFTAddress, getNFT1155Address, getMarketPlaceAddress } from "../libs/addressHelper";
import { useWeb3 } from "../libs/useWeb3";
import NFT from "../contracts/abis/NFT.json";
import NFT1155 from "../contracts/abis/NFT1155.json";
import Marketplace from "../contracts/abis/Marketplace.json";
import { useCurrentUser } from "../libs/useCurrentUser";


const useContract = (abiArtifact, contractAddress) => {
    const web3 = useWeb3();
    return new web3.eth.Contract(abiArtifact, contractAddress);
};

export const useNFT = () => {
    const nft = useContract(NFT, getNFTAddress());

    const tokenURI721 = (itemID) => nft.methods.tokenURI(itemID).call();

    return { nft, tokenURI721 };
};

export const useNFT1155 = () => {
    const nft1155 = useContract(NFT1155, getNFT1155Address());
    const tokenURI1155 = (itemID) => nft1155.methods.tokenURIs(itemID).call();

    return { nft1155, tokenURI1155 };
};

export const useMarketPlace = () => {
    const marketPlace = useContract(Marketplace, getMarketPlaceAddress());

    const itemCount721 = () => marketPlace.methods.itemCount().call();
    const itemCount1155 = () => marketPlace.methods.itemCount1155().call();

    const item721 = (itemID) => marketPlace.methods.items(itemID).call();
    const item1155 = (itemID) => marketPlace.methods.items1155(itemID).call();

    const getTotalPrice721 = (itemID) => marketPlace.methods.getTotalPrice(itemID).call();
    const getTotalPrice1155 = (item, amount) => marketPlace.methods.getTotalPrice1155(item.itemId, amount).call();

    const buy721 = (item, account) => marketPlace.methods.purchaseItem(item.itemId).send({ from: account, value: item.totalPrice }).on('transactionHash', (hash) => {
        console.log(hash, "nft721 purchased transaction hash...");
    });
    const buy1155 = (item, amount, totalAmount, account) => marketPlace.methods.purchaseItem1155(item.itemId, amount).send({ from: account, value: totalAmount }).on('transactionHash', (hash) => {
        console.log(hash, "nft1155 purchased transaction hash...");
    });

    const loadMarketPlaceItems721 = async () => {
        let items = [];
        try {
            const count = await itemCount721(); // no of items to be traversed...
            console.log(count, "this is the Item Count");
            for (let i = 1; i <= count; i++) {
                const item = await item721(i);
                console.log(item, "this the item bhitra bata")
                if (!item.sold) {
                    // get uri url from nft contract
                    const { tokenURI721 } = useNFT();
                    const uri = await tokenURI721(item.itemid);
                    // const uri = await nft.methods.tokenURI(item.itemid).call();
                    // use uri to fetch the nft metadata stored on ipfs 
                    const response = await fetch(uri);
                    const metadata = await response.json();
                    // get total price of item (item price + fee)
                    const totalPrice = await getTotalPrice721(item.itemid);
                    // Add item to items array

                    console.log([item.itemid, metadata.name, metadata.image], "mero returned vava")
                    items.push({
                        totalPrice,
                        itemId: item.itemid,
                        seller: item.seller,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image
                    });

                }
            }
        }
        catch (e) { console.log(e.message, "Error From loadMarketPlaceItems721") }
        return items;
    }

    const loadMarketPlaceItems1155 = async () => {
        let items = [];
        try {
            const count = await itemCount1155();
            for (let i = 1; i <= count; i++) {
                const item = await item1155(i);
                if (!item.stockCleared) {
                    console.log([count, item], "Ma nft1155 LOAD MA XU")
                    // get uri url from nft contract
                    const { tokenURI1155 } = useNFT1155()
                    const tokenURI = await tokenURI1155(item.itemid); //calling the Struct and directly passing to the fetch function
                    // use uri to fetch the nft metadata stored on ipfs 

                    const response = await fetch(tokenURI);
                    const metadata = await response.json();
                    // Add item to items array
                    items.push({
                        itemId: item.itemid,
                        seller: item.seller,
                        price: item.price,
                        amount: item.availableAmount,
                        totalAmount: item.totalAmount,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image
                    });
                }
            }
        } catch (e) { console.log(e.message, "Error From loadMarketPlaceItems721") }
        return items;
    }

    return { marketPlace, loadMarketPlaceItems721, loadMarketPlaceItems1155, getTotalPrice1155, buy721, buy1155 };
};

export default useContract;
