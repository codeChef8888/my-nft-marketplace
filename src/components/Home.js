import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Modal1155 from './BuyModalNFT1155';
import useModal1155 from '../hooks/useModal';
import { useMarketPlace } from "../hooks/useContract";

import { useAccount } from 'wagmi'
const Home = ({ setCurrentUser, setUserActiveStatus, marketPlace, nft, nft1155, web3 }) => {
  //Setting up our required state variables.
  const { address, isConnected } = useAccount();
  const { loadMarketPlaceItems721, loadMarketPlaceItems1155 } = useMarketPlace();
  const account = address;
  const [loading, setloading] = useState(true);
  const [items, setItems] = useState([]);
  const [items1155, setItems1155] = useState([]);
  const [itemTog1155, setItemTog1155] = useState('');
  const { isShowing, toggle } = useModal1155();

  const loadItems721 = async () => {
    loadMarketPlaceItems721().then((items) => setItems(items));
    setloading(false);
  };

  const loadItems1155 = async () => {
    loadMarketPlaceItems1155().then((items) => setItems1155(items));
    setloading(false);
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
    loadItems721();
  };

  const buyMarketNFT1155 = async (item, amount) => {
    try {
      // get total price of item (item price + fee)
      console.log("1st Steeeeeeep");
      let totalPrice = await marketPlace.methods.getTotalPrice1155(item.itemId, amount).call();
      console.log([item.itemId, amount, totalPrice.toString()], "nft1155 selling price")
      await marketPlace.methods.purchaseItem1155(item.itemId, amount).send({ from: account, value: totalPrice }).on('transactionHash', (hash) => {
        console.log("2nd stepppppppp")
        toggle(); // Modal Banda
        setloading(false);

      });
    } catch (e) {
      console.log(e.message);
    }
    loadItems1155();
  };

  //Firing the loadMarketplaceItems function when this functional component loads for once.
  useEffect(() => {
    loadItems721();
    loadItems1155();
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
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => {
                          if (!isConnected) alert("Please Connect Your Wallet First");
                          buyMarketNFT721(item);
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
                            if (!isConnected) alert("Please Connect Your Wallet First!!!");
                            if (item.seller !== account) {
                              toggle();
                              setItemTog1155(item);
                            }
                            else alert("This NFT1155 belongs to you");
                          }
                        }>Buy for {web3.utils.fromWei(item.price, 'ether')} ETH per NFT</Button>
                        <Modal1155 web3={web3} isShowing={isShowing} toggle={toggle} buyMarketNFT1155={buyMarketNFT1155} item={itemTog1155} />
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