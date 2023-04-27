/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Navigation from './components/NavBar';
import Home from './components/Home.js';
import CreateNFT from './components/CreateNFT.js';
import CreateNFT1155 from './components/CreateNFT1155.js';
import MyAuctionedNFTs from './components/MyAuctionedNFTs.js';
import MyPurchases from './components/MyPurchasedNFTs.js';
import { useNFT, useNFT1155, useMarketPlace } from './hooks/useContract';
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiClient } from "./libs/rainbowKit";
import './App.css';



class App extends Component {


  // //1. Load Web3 and Load BlockChain Data
  // async componentWillMount() {
  //   await this.loadWeb3();
  //   await this.loadBlockchainData();
  // }


  async loadBlockchainData() {
    const account = "xoxoxoxoxoxoxoxo";
    this.setState({ account: account });
    const nftContract = useNFT(); //import NFT json.
    this.setState({ nft: nftContract });



    //Load NFT1155 Contract into const variable nftContract.
    const nft1155Contract = useNFT1155();
    this.setState({ nft1155: nft1155Contract });


    //Load Marketplace Contract into const variable tether.
    const marketPlaceContract = useMarketPlace();
    console.log(marketPlaceContract, "marketplace");
    this.setState({ marketPlace: marketPlaceContract });



    this.setState({ loading: false })
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  // //Load the List of NFTs 
  // loadMarketplaceItems = async () => {
  //   // Load all unsold items
  //   const itemCount = await this.state.marketPlace.methods.itemCount().call();
  //   console.log(itemCount.toString(), 'This is the item count in HOME');
  //   //Creating NFT List Array.
  //   let nftsList = [];

  //   for (let i = 1; i <= itemCount; i++) {
  //     const item = await this.state.marketPlace.methods.items(i).call();
  //     if (!item.sold) {
  //       //Getting the uri url from the nft contract.
  //       const uri = this.state.nft.methods.tokenURI(item.tokenId);
  //       // use uri to fetch the nft metadata stored on ipfs 
  //       const response = await fetch(uri);
  //       const metadata = await response.json();
  //       // getting total price of item (item price + transaction fee)
  //       const totalPrice = await this.state.marketPlace.methods.getTotalPrice(item.id).call();
  //       // Add item to items array
  //       nftsList.push({
  //         totalPrice,
  //         itemId: item.itemId,
  //         seller: item.seller,
  //         name: metadata.name,
  //         description: metadata.description,
  //         image: metadata.image
  //       });
  //     }
  //   }
  //   this.setState({ items: nftsList });
  //   this.setState({ loading: false });
  // }

  // //Function to Buy the Displayed NFTs
  // buyNFT = async (item) => {
  //   await this.state.marketPlace.methods.purchaseItem(item.itemid, { value: item.price }).call();
  //   this.loadMarketplaceItems();
  // }
  setCurrentUser(acc) {
    this.setState({ account: acc });
  }
  //2. Set The States
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      setCurrentUser: '',
      nft: {},
      nft1155: {},
      marketPlace: {},
      loading: true
    }

  }

  //Our React Code Goes in Here
  render() {

    return (
      <BrowserRouter>
        <div className="App">
          <Navigation web3Connect={this.web3Handler} account={this.state.account} />
          <div>
            {this.state.loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spinner animation="border" style={{ display: 'flex' }} />
                <p className='mx-3 my-0'>Awaiting Wallet Connection...</p>
              </div>
            ) : (

              <Routes>
                <Route path="/" element={<Home setCurrentUser={this.state.setCurrentUser} marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} />} />
                <Route path="/createNFT" element={<CreateNFT marketPlace={this.state.marketPlace} nft={this.state.nft} account={this.state.account} />} />
                <Route path="/createNFT1155" element={<CreateNFT1155 marketPlace={this.state.marketPlace} nft1155={this.state.nft1155} account={this.state.account} />} />
                <Route path="/my-listed-nfts" element={<MyAuctionedNFTs marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} account={this.state.account} />} />
                <Route path="/my-purchases" element={<MyPurchases marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} account={this.state.account} />} />
              </Routes>
            )}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
