const chai = require('chai');
chai.use(require("chai-events"));
chai.use(require('chai-as-promised'));
chai.should();
var expect = chai.expect;
const assert = require('assert');

const { default: Web3 } = require('web3');
const { ModalFooter } = require('react-bootstrap');


const Marketplace = artifacts.require('Marketplace');
const NFT1155 = artifacts.require('NFT1155');

contract('NFT1155 Auction Test', async ([_owner, addr1, addr2]) => {
    let nft, marketPlace, user1, user2, owner, URI1, URI2;
    owner = _owner;
    user1 = addr1;
    user2 = addr2;
    URI1 = "Sample URI";
    URI2 = "URI Sample";
    price = tokens('1');

    function tokens(number) {
        return web3.utils.toWei(number);
    }
    beforeEach(async () => {
        nft = await NFT1155.new();
        marketPlace = await Marketplace.new(1);

        //Approval For TransferFrom
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr1 });
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr2 });
    });


    it('Commision Account and Commision Fee Matched SuccessFully -> Checked', async () => {
        const feeAccount = await marketPlace.feeAccount();
        const feeRate = await marketPlace.feePercent();
        assert.equal(feeRate.toString(), '1');
        assert.equal(feeAccount.toString(), owner);// not to forget to convert things to string.
    });
    it('Minting NFTs -> Checked', async () => {
        let tokenNumber, userBalance, tokenUri;
        await nft.mint(2, URI1, { from: user1 });
        await nft.mint(4, URI2, { from: user2 });

        userBalance = await nft.balanceOf(user1, 1);
        assert.equal(userBalance.toString(), '2');
        userBalance = await nft.balanceOf(user2, 2);
        assert.equal(userBalance.toString(), '4');
        tokenNumber = await nft.tokenCount();
        assert.equal(tokenNumber.toString(), '2');
        //Checking the tokenURI
        tokenUri = await nft.uri(1);
        assert.equal(tokenUri, URI2);
        tokenUri = await nft.uri(2);
        assert.equal(tokenUri, URI2);
    });

    it('NFT1155 Auctioned Check To Our MarketPlace -> Checked', async () => {
        let amount, blc, tokenUri, items, item;
        //Minting NFT For User1

        amount = 4;
        await nft.mint(amount, URI1, { from: addr1 });
        tokenCount = await nft.tokenCount();
        await marketPlace.makeItem1155(nft.address, tokenCount, amount, price, { from: addr1 });
        //Checking the Tokens URI
        tokenUri = await nft.uri(tokenCount.toString());
        assert.equal(tokenUri.toString(), URI1);
          //Checking the Balance Of the Account i.e. number of specific id of NFT1155's it has.
        blc = await nft.balanceOf(marketPlace.address, tokenCount);
        assert.equal(blc.toString(), amount);
        //Checking the Items field to Ensure Consistency 
        item = await marketPlace.items1155(1);
        assert.equal(item.itemid, 1);
        assert.equal(item.nft, nft.address);
        assert.equal(item.amount, amount);
        assert.equal(item.tokenId.toString(), tokenCount.toString());
        assert.equal(item.price, price);
        assert.equal(item.seller, addr1);
        assert.equal(item.sold, false);

        //Minting NFT For User2
        amount = 5; 
        await nft.mint(amount ,URI2, { from: addr2 });
        //Getting the Token Count that is the Address of the Token
        tokenCount = await nft.tokenCount();
        await marketPlace.makeItem1155(nft.address, tokenCount, amount, price, { from: addr2 });
        //Checking the Tokens URI
        tokenUri = await nft.uri(tokenCount.toString());
        assert.equal(tokenUri.toString(), URI2);
        //Checking the Balance Of the Account i.e. number of specific id of NFT1155's it has.
        blc = await nft.balanceOf(marketPlace.address, tokenCount);
        assert.equal(blc.toString(), amount);
        //Checking the Items field to Ensure Consistency 
        item = await marketPlace.items1155(2);
        assert.equal(item.itemid, 2);
        assert.equal(item.nft, nft.address);
        assert.equal(item.tokenId.toString(), tokenCount.toString());
        assert.equal(item.price, price);
        assert.equal(item.seller, addr2);
        assert.equal(item.sold, false);

    });

    it('If Price Less than 0 Reject-> Checked', async () => {
        let amount = 4;
        await nft.mint(amount, URI1, { from: addr1 });
        tokenCount = await nft.tokenCount();
        price = tokens('0');
        await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr2 }).should.be.rejected;

    });

    it('If Amount Less than 0 Reject-> Checked', async () => {
        let amount = 0;
        await nft.mint(amount, URI1, { from: addr1 }).should.be.rejected;
        tokenCount = await nft.tokenCount();
        price = tokens('2');
        await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr2 }).should.be.rejected;

    });

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

contract('Item1155 Purchase Functionality Tests ', async ([_owner, addr1, addr2, addr3]) => {

    let
        nft, marketPlace,
        URI1 = "Sample URI",
        price = tokens('1'),
        tokenCount,
        amount = 2,
        feePercent = 1,
        fee = (feePercent / 100) * price,
        totalPrice = 0,
        item;

    function tokens(number) {
        return web3.utils.toWei(number);
    }


    beforeEach(async () => {
        nft = await NFT1155.new();
        marketPlace = await Marketplace.new(1);

        //Approval For TransferFrom
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr1 });
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr2 });

        await nft.mint(amount, URI1, { from: addr1 });
        tokenCount = await nft.tokenCount(); //Id of Recently Minted NFT
        amount = 2;
        await marketPlace.makeItem1155(nft.address, tokenCount, amount, price, { from: addr1 });

    });

    it('The Inital/Final Balance of Seller/Marketplace ,Selling feature -> Checked', async () => {
        //Getting the inital balances of seller and marketplace.
        const sellerIntialBalance = await web3.eth.getBalance(addr1);
        const feeAccountIntialBalance = await web3.eth.getBalance(_owner);
        item = await marketPlace.items1155(tokenCount);
        let itemPrice = item.price;
        console.log(itemPrice.toString(), "this is the item1155 price");
        //Getting the TotalPrice of NFT1155 with the Extra Fee For Transaction.
        totalPrice = await marketPlace.getTotalPrice1155(1, 2); // i.e. tokenCount = 1; Only One NFT minted till now
        console.log([sellerIntialBalance, feeAccountIntialBalance, tokenCount.toString(), totalPrice.toString()], "initial");

        //Purchasing an NFT
        await marketPlace.purchaseItem1155(tokenCount, 2, { from: addr2, value: totalPrice });
        //Verifying the Balance Of NFT1155 after Purchasing it.
        blc = await nft.balanceOf(addr2, tokenCount);
        assert.equal(blc.toString(), '2');

        //NFT Status Check after being SOLD
        item = await marketPlace.items1155(tokenCount);
        assert.equal(item.sold, true);

        //Getting the final balances of seller and marketplace after succesful selling of NFT
        const sellerFinalBalance = await web3.eth.getBalance(addr1);
        const feeAccountFinalBalance = await web3.eth.getBalance(_owner);
        //Evaluating New Seller Balance After Transaction to Compare with The sellerFinalBalance
        const newSellerBalance = parseInt(sellerIntialBalance) + parseInt(price * amount);
        //Evaluating New MarketPlace Balance After Transaction to Compare with The feeAccountFinalBalance
        const newFeeAccoutBalance = parseInt(feeAccountIntialBalance) + parseInt(fee * amount);
        // Verifying the Balance OF Buyer and Marketplace after Succesful Selling (transaction) of a NFT.
        assert.equal(sellerFinalBalance, newSellerBalance.toString());
        assert.equal(feeAccountFinalBalance, newFeeAccoutBalance.toString());
    });

    it("Should fail for invalid item ids, sold items and when not enough ether is paid -> Checked", async function () {
        totalPrice = await marketPlace.getTotalPrice1155(tokenCount, amount);
        //Checking for Unavailable NFT item id's.
        await marketPlace.purchaseItem1155(2, amount, { value: totalPrice, from: addr2 }).should.be.rejected;
        await marketPlace.purchaseItem1155(0, amount, { value: totalPrice, from: addr2 }).should.be.rejected;
        //Checking for Insufficient Payment.
        let lowPrice = tokens('2');
        await marketPlace.purchaseItem1155(0, amount, { value: lowPrice, from: addr2 }).should.be.rejected;
        //Checking if already sold item can be purchased??
        await marketPlace.purchaseItem1155(1, amount, { value: totalPrice, from: addr2 });
        await marketPlace.purchaseItem1155(1, amount, { value: totalPrice, from: addr3 }).should.be.rejected;
    });

});