import React, { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { useAccount } from "wagmi";
import { createNFT721, uploadToIPFS } from "../hooks/useUploadToIPFS";

const Create = () => {
  // let web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_RPC_URL);
  const { address, isConnected } = useAccount();
  const account = address;

  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
                onChange={(event) => {
                  uploadToIPFS(event.target.files[0])
                    .then((path) =>
                      setImage(`https://ipfs.infura.io/ipfs/${path}`)
                    )
                    .catch((error) =>
                      console.log(error.message, "UPLOAD TO IPFS ERROR!!!!")
                    );
                }}
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
                  onClick={() => {
                    if (!isConnected)
                      alert("Please Connect Your Wallet First!!!");
                    else createNFT721(image, price, name, description, account);
                  }}
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
