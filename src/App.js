import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Web3 from 'web3';
import NFT from './truffle_abis/NFT.json';
import NFT1155 from './truffle_abis/NFT1155.json';
import Marketplace from './truffle_abis/Marketplace.json';
import Navigation from './components/NavBar';
import Home from './components/Home.js'
import CreateNFT from './components/CreateNFT.js'
import CreateNFT1155 from './components/CreateNFT1155.js'
import MyListedItems from './components/MyListedNFTs.js'
import MyPurchases from './components/MyPurchases.js'
import './App.css';



class App extends Component {

  // //1. Load Web3 and Load BlockChain Data
  // async componentWillMount() {
  //   await this.loadWeb3();
  //   await this.loadBlockchainData();
  // }

  web3Handler = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non ethereum browser detected. You should consider Metamask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    //Get the User Account from Ganache i.e in Ganache it's index is 1 here In account array it is the First i.e 0
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    web3.eth.defaultAccount = accounts[0];

    //3.Specify from which Ethereum network You are loading Using Network ID. 
    const networkId = await web3.eth.net.getId();

    //Load NFT Contract
    const nftData = NFT.networks[networkId];
    //Check if the networkId exists
    if (nftData) {

      //Load NFT721 Contract into const variable nftContract.
      const nftContract = new web3.eth.Contract(NFT.abi, nftData.address); //import NFT json.
      this.setState({ nft: nftContract });

      //  //Get The Tether Balance of User
      //  let tetherBalance = await tetherContract.methods.balanceOf(this.state.account).call(); //it's callback funciton
      //  this.setState({tetherBalance: tetherBalance.toString()});
    } else {
      window.alert('Error, NFT contract not deployed - no detected network!!!')
    }

      //Load NFT1155 Contract
      const nft1155Data = NFT1155.networks[networkId];
      //Check if the networkId exists
      if (nft1155Data) {
  
        //Load NFT1155 Contract into const variable nftContract.
        const nft1155Contract = new web3.eth.Contract(NFT1155.abi, nft1155Data.address); //import NFT1155 json.
        this.setState({ nft1155: nft1155Contract });
 
        //  //Get The Tether Balance of User
        //  let tetherBalance = await tetherContract.methods.balanceOf(this.state.account).call(); //it's callback funciton
        //  this.setState({tetherBalance: tetherBalance.toString()});
      } else {
        window.alert('Error, NFT1155 contract not deployed - no detected network!!!')
      }

    //Load Marketplace Contract
    const marketPlaceData = Marketplace.networks[networkId];
    //Check if the networkId exists
    if (marketPlaceData) {

      //Load Marketplace Contract into const variable tether.
      const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, marketPlaceData.address); //import Marketplace json.

      this.setState({ marketPlace: marketPlaceContract });

      //  //Get The Tether Balance of User
      //  let rwdBalance = await rwdContract.methods.balanceOf(this.state.account).call(); //it's callback funciton
      //  this.setState({rwdBalance: rwdBalance.toString()});

    } else {
      window.alert('Error, Marketplace contract not deployed - no detected network!!!')
    }

    this.setState({ loading: false })
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

  //2. Set The States
  constructor(props) {
    super(props);
    this.state = {
      account: '',
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
                <Route path="/" element={<Home account={this.state.account} marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155}/>} />
                <Route path="/createNFT" element={<CreateNFT marketPlace={this.state.marketPlace} nft={this.state.nft} account={this.state.account} />} />
                <Route path="/createNFT1155" element={<CreateNFT1155 marketPlace={this.state.marketPlace} nft1155={this.state.nft1155} account={this.state.account} />} />
                <Route path="/my-listed-nfts" />
                <Route path="/my-purchases" />
              </Routes>
            )}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
