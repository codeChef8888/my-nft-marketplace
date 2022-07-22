import { throws } from 'assert';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default function MyPurchases({ marketPlace, nft, nft1155, account, isConnected, web3 }) {

    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);
    const [purchases1155, setPurchases1155] = useState([]);

    const loadPurchasedNFTs = async () => {
        // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
        let filterOptions = {
            filter: {
                buyer: [account]    //Only get events where transfer value was 1000 or 1337
            },
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
        }
        const result = await marketPlace.getPastEvents('Bought', filterOptions).then(results => {
            getNFTs(results);
        })
            .catch(err => console.log(err));
    }

    async function getNFTs(results) {
        console.log([results], "this is the argument results 721");

        const purchases = await Promise.all(results.map(async payload => {
            // fetch arguments from each result
            //    i.events.Bought.returnValues[];
            let item = payload.returnValues;
            console.log([item], "item721");

            try {
                // get uri url from nft contract
                const uri = await nft.methods.tokenURI(item.tokenId).call();
                // use uri to fetch the nft metadata stored on ipfs 
                const response = await fetch(uri)
                const metadata = await response.json()
                // get total price of item (item price + fee)
                const totalPrice = await marketPlace.methods.getTotalPrice(item.itemId).call();
                // define listed item object
                let purchasedItem = {
                    totalPrice,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                };
                return purchasedItem;
            } catch (e) {
                console.log(e.message, "The Error On loading NFT721 based on user!!!");
            }
        }))

        setLoading(false);
        setPurchases(purchases);
    }



    const loadPurchasedNFT1155s = async () => {
        // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
        let filterOptions = {
            filter: {
                buyer: [account]    //Only get events where transfer value was 1000 or 1337
            },
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
        }
        const result = await marketPlace.getPastEvents('Bought1155', filterOptions).then(results => {
            getNFT1155s(results);
        })
            .catch(err => console.log(err));
    }

    async function getNFT1155s(results) {
        console.log([results], "arguments results 1155...");

        const purchases1155 = await Promise.all(results.map(async payload => {
            // fetch arguments from each result
            //    i.events.Bought.returnValues[];
            let item = payload.returnValues;
            console.log([item], "this is the argument");
            // get uri url from nft contract

            try {
                const uri = await nft1155.methods.tokenURIs(item.itemId).call();
                // use uri to fetch the nft metadata stored on ipfs  
                const response = await fetch(uri);
                const metadata = await response.json();
                //  get total price of item (item price + fee)
                const totalPrice = await marketPlace.methods.getTotalPrice1155(item.itemId, item.amount).call();

                let purchasedItem1155 = {
                    totalPrice,
                    amount: item.amount,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                };
                // define listed item object
                return purchasedItem1155;
            } catch (e) {
                console.log(e.message, "The Error Msg On Loading Purchased NFT1155 by Logged In User!!!");
            }
        }))
        setLoading(false);
        setPurchases1155(purchases1155);
    }



    useEffect(() => {
        if (isConnected) {
            loadPurchasedNFTs();
            loadPurchasedNFT1155s();
        }
        else {
            alert("Please Connect Your Wallet");
        }
    }, []);

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            {isConnected === true ? <h2>Loading...</h2> : (<h2>Connect Your Wallet...</h2>)}
        </main>
    )
    return (
        <div>
            <div className="flex justify-center">
                {purchases.length > 0 ?
                    <div className="px-5 container">
                        <Row xs={1} md={2} lg={4} className="g-4 py-5">
                            {purchases.map((item, idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant="top" src={item.image} />
                                        <Card.Footer>{web3.utils.fromWei(item.totalPrice, 'ether')} ETH</Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    : (
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No purchased NFT721</h2>
                        </main>
                    )}
            </div>
            <div className="flex justify-center">
                {purchases1155.length > 0 ?
                    <div className="px-5 container">
                        <Row xs={1} md={2} lg={4} className="g-4 py-5">
                            {purchases1155.map((item, idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant="top" src={item.image} />
                                        <Card.Body color="secondary">
                                            <Card.Text>
                                                No. of NFTs: {item.amount}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>{web3.utils.fromWei(item.totalPrice, 'ether')} ETH</Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    : (
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No purchased NFT1155</h2>
                        </main>
                    )}
            </div>
        </div>
    );
};