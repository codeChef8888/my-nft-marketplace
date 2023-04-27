import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default function MyPurchases({ marketPlace, nft, nft1155, account }) {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);

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
            console.log(results);
            getNFTs(results);
        })
            .catch(err => console.log(err));

        async function getNFTs(results) {

            const purchases = await Promise.all(results.map(async payload => {
                // fetch arguments from each result
                //    i.events.Bought.returnValues[];
                let item = payload.returnValues;
                console.log([], "this is the argument");
                // get uri url from nft contract
                const uri = await nft.methods.tokenURI(item.tokenId).call();
                // use uri to fetch the nft metadata stored on ipfs 
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

            }))

            setLoading(false);
            setPurchases(purchases);
        }

    }

    useEffect(() => {
        loadPurchasedNFTs();
    }, []);

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className="flex justify-center">
            {purchases.length > 0 ?
                <div className="px-5 container">
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        {purchases.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image} />
                                    <Card.Footer>{window.web3.utils.fromWei(item.totalPrice, 'ether')} ETH</Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
                : (
                    <main style={{ padding: "1rem 0" }}>
                        <h2>No purchases</h2>
                    </main>
                )}
        </div>
    );
};