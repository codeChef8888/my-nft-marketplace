import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Navigation from './components/NavBar';
import Home from './components/Home.js'
import CreateNFT from './components/CreateNFT.js'
import CreateNFT1155 from './components/CreateNFT1155.js'
import MyAuctionedNFTs from './components/MyAuctionedNFTs.js'
import MyPurchases from './components/MyPurchasedNFTs.js'
import { useNFT, useNFT1155, useMarketPlace } from './hooks/useContract';
import './assests/App.css';
import { useWeb3 } from './libs/useWeb3';


class App extends Component {


  async loadBlockchainData() {
    //Load Web3
    const web3 = useWeb3();
    this.setState({ web3: web3 });
    //Load NFT Contract
    const { nft } = useNFT(); //import NFT json.
    this.setState({ nft: nft });
    //Load NFT1155 Contract into const variable
    const { nft1155 } = useNFT1155();
    this.setState({ nft1155: nft1155 });
    //Load Marketplace Contract into const variable 
    const { marketPlace } = useMarketPlace();
    this.setState({ marketPlace: marketPlace });
    this.setState({ loading: false })
  }

  componentDidMount() {
    this.loadBlockchainData();
  }


  //Setting The State Vars
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      userStatus: false,
      nft: {},
      nft1155: {},
      marketPlace: {},
      web3: '',
      loading: true
    }

  }

  //Our React Code Goes in Here
  render() {

    return (
      <BrowserRouter>
        <div className="App">
          <Navigation account={this.state.account} />
          <div>
            {this.state.loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spinner animation="border" style={{ display: 'flex' }} />
                <p className='mx-3 my-0'>Awaiting Wallet Connection...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home setCurrentUser={(addr) => this.setState({ account: addr })} setUserActiveStatus={(bool) => this.setState({ userStatus: bool })} marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} web3={this.state.web3} />} />
                <Route path="/createNFT" element={<CreateNFT marketPlace={this.state.marketPlace} nft={this.state.nft} account={this.state.account} isConnected={this.state.userStatus} web3={this.state.web3} />} />
                <Route path="/createNFT1155" element={<CreateNFT1155 marketPlace={this.state.marketPlace} nft1155={this.state.nft1155} account={this.state.account} isConnected={this.state.userStatus} web3={this.state.web3} />} />
                <Route path="/my-listed-nfts" element={<MyAuctionedNFTs marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} account={this.state.account} isConnected={this.state.userStatus} web3={this.state.web3} />} />
                <Route path="/my-purchases" element={<MyPurchases marketPlace={this.state.marketPlace} nft={this.state.nft} nft1155={this.state.nft1155} account={this.state.account} isConnected={this.state.userStatus} web3={this.state.web3} />} />
              </Routes>
            )}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
