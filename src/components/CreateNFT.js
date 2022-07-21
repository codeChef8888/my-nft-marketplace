import React, { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const Create = ({ marketPlace, nft, account, isConnected, web3 }) => {

  // let web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_RPC_URL);
  // const web3 = useWeb3();

  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file); // IPFS client
        console.log(result, "yo result ho");
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`); //setting the Image to the link where we can img file on IPFS
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  const createNFT = async () => {
    if (isConnected) {
      if (!image || !price || !name || !description) return;
      try {
        //Upload all of the metadata to IPFS
        const result = await client.add(
          JSON.stringify({ image, price, name, description })
        ); //Adding metadata in JSON with Object containing metadata.
        console.log(image, price, name, description, "yei ho resuslt");
        //Mint NFT and Auction it in Marketplace.
        mintThenList(result);
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
      }
    }
    else {
      alert("Connect your wallet first!!!")
    }
  };

  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`; //Points to metadata of the NFT located on IPFS.
    console.log(result, "this is the result haaaaiiii");
    if (nft != null) {
      console.log("nft is not null");
      //Mint the NFT
      await nft.methods
        .mint(uri)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          console.log("nft minted");
        });

      // get tokenId of new nft
      const tokenId = await nft.methods.tokenCount().call();
      console.log(tokenId, "this is the token id");
      console.log(marketPlace._address, "this is the market addresss");

      // add nft to marketplace
      const listingPrice = web3.utils.toWei(price.toString(), "ether");
      console.log(listingPrice, "this is the NFT price in wei");
      // approve marketplace to spend nft

      await nft.methods
        .setApprovalForAll(marketPlace._address, true)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          console.log(
            [nft._address, tokenId, listingPrice],
            "la chireyma NFT banauna lai"
          );
          marketPlace.methods
            .makeItem(nft._address, tokenId, listingPrice)
            .send({ from: account })
            .on("transactionHash", (hash) => {
              console.log("hum Idharr");
              const totalItem = marketPlace.methods.itemCount().call();
              console.log(totalItem, "la banyou tmro NFT lai");
            });
        });
    }
  };
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button
                  onClick={
                    createNFT
                  }
                  variant="primary"
                  size="lg"
                >
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
