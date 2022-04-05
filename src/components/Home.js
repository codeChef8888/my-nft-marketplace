import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Modal1155 from './BuyModalNFT1155';
import useModal1155 from '../hooks/useModal';

const Home = ({ account, marketPlace, nft, nft1155 }) => {
  //Setting up our required state variables.
  const [loading, setloading] = useState(true);
  const [items, setItems] = useState([]);
  const [items1155, setItems1155] = useState([]);

  const { isShowing, toggle } = useModal1155();

  //Function to Load NFT in MarketPlace for Display.
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketPlace.methods.itemCount().call();
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
      if (!item1155.sold) {
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
          amount: item1155.amount,
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
    try {
      await marketPlace.methods.purchaseItem(item.itemId).send({ from: account, value: item.totalPrice }).on('transactionHash', (hash) => {
        setloading(false);

      });
    } catch (error) {
      console.log(error)
    }

    loadMarketplaceItems();
  };

  const buyMarketNFT1155 = async (item, amount) => {
    try {
      // get total price of item (item price + fee)
      let totalPrice = await marketPlace.methods.getTotalPrice1155(item.itemId, amount).call();
      console.log([amount, totalPrice.toString()], "nft1155 selling price")
      let money = window.web3.utils.toWei('10', 'ether');
      await marketPlace.methods.purchaseItem1155(item.itemId, amount).send({ from: account, value: totalPrice}).on('transactionHash', (hash) => {
        setloading(false);

      });
    } catch (error) {
      console.log(error)
    }

    loadMarketplaceItems1155();
  };

  //Firing the loadMarketplaceItems function when this functional component loads for once.
  useEffect(() => {
    loadMarketplaceItems();
    loadMarketplaceItems1155();
  }, []);

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
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => buyMarketNFT721(item)} variant="primary" size="lg">
                          Buy for {window.web3.utils.fromWei(item.totalPrice, 'ether')} ETH
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
              <h2>No listed assets</h2>
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
                        {item.amount}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button className="button-default" onClick={toggle}>Buy</Button>
                        <Modal1155 isShowing={isShowing} toggle={toggle} buyMarketNFT1155={buyMarketNFT1155} item={item} />
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
            </main>
          )}
      </div>
    </div>
  );
}

export default Home;