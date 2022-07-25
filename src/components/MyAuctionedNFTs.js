import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import { useWeb3 } from '../libs/useWeb3';
const web3 = useWeb3();
function renderSoldItems(items) {
    return (
        <>
            <h2>Sold NFTs ERC721</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden">
                        <Card>
                            <Card.Body color="secondary">
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Img variant="top" src={item.image} />
                            </Card.Body>
                            <Card.Footer>
                                For {web3.utils.fromWei(item.totalPrice, 'ether')} ETH - Recieved {web3.utils.fromWei(item.price, 'ether')} ETH
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

function renderSoldItems1155(items) {
    return (
        <>
            <h2>Sold NFTs ERC1155</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden">
                        <Card>
                            <Card.Body color="secondary">
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Img variant="top" src={item.image} />
                                <Card.Text>
                                    No. of NFTs: {item.totalAmount - item.amount} / {item.totalAmount}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                For {web3.utils.fromWei(item.totalPrice, 'ether')} ETH - Recieved {web3.utils.fromWei(item.price, 'ether')} ETH
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}
export default function MyAuctionedNFTs({ marketPlace, nft, nft1155, web3 }) {
    const { address, isConnected } = useAccount();
    const account = address;
    const [loading, setLoading] = useState(true);
    //Setting State Var. for NFT721
    const [listedItems, setListedItems] = useState([]);
    const [soldItems, setSoldItems] = useState([]);
    //Setting State Var. for NFT1155
    const [listedItems1155, setListedItems1155] = useState([]);
    const [soldItems1155, setSoldItems1155] = useState([]);

    // Load all sold items that the user listed
    const loadListedItems = async () => {

        const itemCount = await marketPlace.methods.itemCount().call();
        console.log(itemCount, "this is the item count for the list");
        let listedItems = [];
        let soldItems = [];

        for (let i = 1; i <= itemCount; i++) {
            const item = await marketPlace.methods.items(i).call();
            console.log([item.seller.toLowerCase(), account], "ma ya pugisakey hai..");

            if (item.seller.toLowerCase() === account.toLowerCase()) {

                // get uri url from nft contract
                const uri = await nft.methods.tokenURI(item.itemid).call();
                // use uri to fetch the nft metadata stored on ipfs 
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of item (item price + fee)
                const totalPrice = await marketPlace.methods.getTotalPrice(item.itemid).call();
                // define listed item object
                let NFT = {
                    totalPrice,
                    price: item.price,
                    itemId: item.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                }

                // Add listed item to list/sold items array based on item.sold status
                if (item.sold) {
                    soldItems.push(NFT);
                } else {
                    listedItems.push(NFT);
                }
            }
        }
        setLoading(false);
        setListedItems(listedItems);
        setSoldItems(soldItems);
    }
    // Load all sold items that the user listed
    const loadListedItems1155 = async () => {

        const itemCount = await marketPlace.methods.itemCount1155().call();
        console.log(itemCount, "this is the item count for the list");
        let listedItems1155 = [];
        let soldItems1155 = [];

        for (let i = 1; i <= itemCount; i++) {
            const item1155 = await marketPlace.methods.items1155(i).call();
            console.log([item1155.seller.toLowerCase(), account], "ma ya pugisakey hai..");

            if (item1155.seller.toLowerCase() === account.toLowerCase()) {

                // get uri url from nft contract
                const tokenURI = await nft1155.methods.tokenURIs(item1155.itemid).call(); //calling the Struct and directly passing to the fetch function
                // use uri to fetch the nft metadata stored on ipfs 
                const response = await fetch(tokenURI);
                const metadata = await response.json();
                // get total price of item (item price + fee)
                const totalPrice = await marketPlace.methods.getTotalPrice1155(item1155.itemid, item1155.totalAmount - item1155.availableAmount).call();
                // define listed item object
                let NFT1155 = {
                    totalPrice,
                    price: item1155.price,
                    itemId: item1155.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    amount: item1155.availableAmount,
                    totalAmount: item1155.totalAmount
                }

                // Add listed item to list/sold items array based on item.sold status
                if (!item1155.stockCleared && item1155.sold) {
                    soldItems1155.push(NFT1155);
                    listedItems1155.push(NFT1155);
                } else if (item1155.stockCleared && item1155.sold) {
                    soldItems1155.push(NFT1155);
                } else {
                    listedItems1155.push(NFT1155);
                }
            }
        }
        setLoading(false);
        setListedItems1155(listedItems1155);
        setSoldItems1155(soldItems1155);
    }

    useEffect(() => {
        if (!isConnected) alert("Connect your wallet first!!!");
        loadListedItems();
        loadListedItems1155();
    }, []);

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            {isConnected === true ? <h2>Loading...</h2> : (<h2>Connect Your Wallet...</h2>)}
        </main>
    )
    return (
        <div className="flex justify-center">
            <div>
                {soldItems.length > 0 && renderSoldItems(soldItems)}
                {listedItems.length > 0 ?
                    <div className="px-5 py-3 container">
                        <h2>Listed ERC721</h2>
                        <Row xs={1} md={2} lg={4} className="g-4 py-3">
                            {listedItems.map((item, idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant="top" src={item.image} />
                                        <Card.Body color="secondary" >
                                            <Card.Title>{item.name}</Card.Title>
                                        </Card.Body>
                                        <Card.Footer>{web3.utils.fromWei(item.totalPrice)} ETH</Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    </div>
                    : (
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No listed NFTs721</h2>
                        </main>
                    )}
            </div>
            <div>
                {soldItems1155.length > 0 && renderSoldItems1155(soldItems1155)}
                {listedItems1155.length > 0 ?
                    <div className="px-5 py-3 container">
                        <h2>Listed ERC1155</h2>
                        <div>
                            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                                {listedItems1155.map((item, idx) => (

                                    <Col key={idx} className="overflow-hidden">
                                        <Card>
                                            <Card.Img variant="top" overflow="hidden" src={item.image} />
                                            <Card.Body color="secondary">
                                                <Card.Title>{item.name}</Card.Title>
                                                <Card.Text>
                                                    No. of NFTs: {item.amount} / {item.totalAmount}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                For {web3.utils.fromWei(item.totalPrice, 'ether')} ETH - Recieved {web3.utils.fromWei(item.price, 'ether')} ETH
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                    : (
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No listed NFTs1155</h2>
                        </main>
                    )}
            </div>
        </div>

    );
}