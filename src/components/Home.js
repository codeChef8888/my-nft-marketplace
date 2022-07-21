import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Modal1155 from './BuyModalNFT1155';
import useModal1155 from '../hooks/useModal';

import { useAccount } from 'wagmi'
const Home = ({ setCurrentUser, setUserActiveStatus, marketPlace, nft, nft1155, web3 }) => {
  //Setting up our required state variables.
  const { address, isConnected } = useAccount();
  const account = address;
  const [loading, setloading] = useState(true);
  const [items, setItems] = useState([]);
  const [countItem, setCountItem] = useState('');
  const [items1155, setItems1155] = useState([]);

  const { isShowing, toggle } = useModal1155();

  //Function to Load NFT in MarketPlace for Display.
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    var itemCount;

    console.log(marketPlace, "yo bhitra chireypachi")
    try {
      itemCount = await marketPlace.methods.itemCount().call();
      setCountItem(itemCount.length);
    } catch (e) {
      console.log(e.message);
    }
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketPlace.methods.items(i).call();

      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.methods.tokenURI(item.itemid).call();
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketPlace.methods.getTotalPrice(item.itemid).call();
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
    setloading(false);
    setItems(items);
  };

  //Function to Load NFT1155 in MarketPlace for Display.
  const loadMarketplaceItems1155 = async () => {
    // Load all unsold items
    const itemCount = await marketPlace.methods.itemCount1155().call();

    let items1155 = [];
    for (let i = 1; i <= itemCount; i++) {
      const item1155 = await marketPlace.methods.items1155(i).call();

      if (!item1155.stockCleared) {
        console.log([itemCount, item1155], "Ma nft1155 LOAD MA XU")
        // get uri url from nft contract
        const tokenURI = await nft1155.methods.tokenURIs(item1155.itemid).call(); //calling the Struct and directly passing to the fetch function
        // use uri to fetch the nft metadata stored on ipfs 

        const response = await fetch(tokenURI);
        const metadata = await response.json();
        // Add item to items array
        items1155.push({
          itemId: item1155.itemid,
          seller: item1155.seller,
          price: item1155.price,
          amount: item1155.availableAmount,
          totalAmount: item1155.totalAmount,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        });
      }
    }
    setloading(false);
    setItems1155(items1155);
  };

  const buyMarketNFT721 = async (item) => {
    if (item.seller !== account) {
      try {
        await marketPlace.methods.purchaseItem(item.itemId).send({ from: account, value: item.totalPrice }).on('transactionHash', (hash) => {
          setloading(false);
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      alert("This NFT Belongs to you!!!");
    }

    loadMarketplaceItems();
  };

  const buyMarketNFT1155 = async (item, amount) => {

    try {
      // get total price of item (item price + fee)
      console.log("1st Steeeeeeep");
      let totalPrice = await marketPlace.methods.getTotalPrice1155(item.itemId, amount).call();
      console.log([amount, totalPrice.toString()], "nft1155 selling price")
      await marketPlace.methods.purchaseItem1155(item.itemId, amount).send({ from: account, value: totalPrice }).on('transactionHash', (hash) => {
        console.log("2nd stepppppppp")
        toggle(); // Modal Banda
        setloading(false);

      });
    } catch (e) {
      console.log(e.message);
    }

    loadMarketplaceItems1155();
  };

  //Firing the loadMarketplaceItems function when this functional component loads for once.
  useEffect(() => {
    loadMarketplaceItems();
    loadMarketplaceItems1155();
  }, []);

  useEffect(() => {
    console.log("setting user account!!!");
    setCurrentUser(account);
    setUserActiveStatus(isConnected);
  }, [account]);

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading....</h2>
    </main>
  );

  return (
    <div className="flex justify-center">
      <div>
        {items.length > 0 ?
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {items.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => {
                          if (isConnected)
                            buyMarketNFT721(item)
                          else alert("Please Connect Your Wallet First")
                        }} variant="primary" size="lg">
                          Buy for {web3.utils.fromWei(item.totalPrice, 'ether')} ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>Sold Out!!! (NFT721)</h2>
            </main>
          )}
      </div>
      <div>
        {items1155.length > 0 ?
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {items1155.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                      <Card.Text>
                        No. of NFTs: {item.amount} / {item.totalAmount}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button className="button-default" onClick={
                          () => {
                            if (isConnected) {
                              if (item.seller !== account)
                                toggle();
                              else alert("This NFT1155 belongs to you");
                            } else alert("Connect Your wallet First!!!")
                          }
                        }>Buy</Button>
                        <Modal1155 web3={web3} isShowing={isShowing} toggle={toggle} buyMarketNFT1155={buyMarketNFT1155} item={item} />
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>Sold Out!!! (NFT1155)</h2>
            </main>
          )}
      </div>
    </div >
  );
}

export default Home;