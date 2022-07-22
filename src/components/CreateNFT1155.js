import React, { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useAccount } from 'wagmi'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateNFT1155 = ({ marketPlace, nft1155, web3 }) => {
    const { address, isConnected } = useAccount();
    const account = address;

    const [image, setImage] = useState('')
    const [price, setPrice] = useState(null)
    const [amount, setAmount] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file); // IPFS client
                console.log(result);
                setImage(`https://ipfs.infura.io/ipfs/${result.path}`); //setting the Image to the link where we can img file on IPFS
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    }

    const createNFT1155 = async () => {
        if (!image || !price || !amount || !name || !description) return
        try {
            //Upload all of the metadata to IPFS
            const result = await client.add(JSON.stringify({ image, price, amount, name, description })); //Adding metadata in JSON with Object containing metadata.
            console.log([result], 'yei ho resuslt');
            //Mint NFT and Auction it in Marketplace.
            mintThenList1155(result, amount);
        } catch (error) {
            console.log("ipfs uri upload error: ", error);
        }
    }

    const mintThenList1155 = async (result, amount) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`; //Points to metadata of the NFT located on IPFS.
        console.log(result, 'this is the result haaaaiiii');
        try {

            console.log("nft is not null");
            console.log(amount, "nft amount");
            //Mint the NFT1155
            await nft1155.methods.mint(amount, uri).send({ from: account }).on('transactionHash', (hash) => {
                console.log("nft minted");
            });

            // get tokenId of new nft1155 
            const tokenId = await nft1155.methods.tokenCount().call();
            console.log(tokenId, "this is the token id")
            console.log(marketPlace._address, 'this is the market addresss');

            // add nft1155 to marketplace
            const listingPrice = web3.utils.toWei(price.toString(), 'ether');
            console.log(listingPrice, 'this is the NFT price in wei');


            await nft1155.methods.setApprovalForAll(marketPlace._address, true).send({ from: account })
                .on('transactionHash', (hash) => {
                    console.log("la chireyma NFT banauna lai");
                    marketPlace.methods.makeItem1155(nft1155._address, tokenId, amount, listingPrice).send({ from: account })
                        .on('transactionHash', (hash) => {
                            const totalItem = marketPlace.methods.itemCount1155().call();
                            console.log(totalItem, "la banyou harmo NFT lai");
                        });
                });
        } catch (e) {
            console.log(e.message);
        }

    }

    return (
        <div className="container-fluid mt-5">

            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                            <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="number" placeholder="No. of Copies" />
                            <div className="d-grid px-0">
                                <Button onClick={
                                    () => {
                                        if (isConnected)
                                            createNFT1155();
                                        else alert("Please Connect Your Wallet First!!!");
                                    }

                                } variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>

        </div>

    );
}

export default CreateNFT1155