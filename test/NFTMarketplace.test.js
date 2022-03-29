const chai = require('chai');
chai.use(require("chai-events"));
chai.use(require('chai-as-promised'));
chai.should();
var expect = chai.expect;
const assert = require('assert');

const { default: Web3 } = require('web3');
const { ModalFooter } = require('react-bootstrap');

const NFT = artifacts.require('NFT');
const Marketplace = artifacts.require('Marketplace');

// contract('NFTMarketplace Test', async ([_owner, addr1, addr2]) => {
//     let nft, marketPlace, user1, user2, owner, URI1, URI2;
//     owner = _owner;
//     user1 = addr1;
//     user2 = addr2;
//     URI1 = "Sample URI";
//     URI2 = "URI Sample";
//     beforeEach(async () => {
//         nft = await NFT.new();
//         marketPlace = await Marketplace.new(1);
//     });

//     describe('NFT Deployement Test', async () => {
//         it('Name Matched SuccessFully', async () => {
//             const name = await nft.name();
//             assert.equal(name, 'MyNFT');
//         });
//         it('Symbol Matched SuccessFully', async () => {
//             const symbol = await nft.symbol();
//             assert.equal(symbol, 'NFT');
//         });
//         it('Commision Account and Commision Fee Matched SuccessFully', async () => {
//             const feeAccount = await marketPlace.feeAccount();
//             const feeRate = await marketPlace.feePercent();
//             assert.equal(feeRate.toString(), '1');
//             assert.equal(feeAccount.toString(), owner);// not to forget converting things to string.
//         });
//         it('Minting NFTs', async () => {
//             let tokenNumber, userBalance, tokenUri;
//             await nft.mint(URI1, { from: user1 });
//             await nft.mint(URI2, { from: user2 });

//             userBalance = await nft.balanceOf(user1);
//             assert.equal(userBalance.toString(), '1');
//             userBalance = await nft.balanceOf(user2);
//             assert.equal(userBalance.toString(), '1');
//             tokenNumber = await nft.tokenCount();
//             assert.equal(tokenNumber.toString(), '2');
//             tokenUri = await nft.tokenURI(1);
//             assert.equal(tokenUri, URI1)
//             tokenUri = await nft.tokenURI(2);
//             assert.equal(tokenUri, URI2);
//         });
//         //Checking the  Addresses Of User Account.
//         // it('User Cross Checking Successful', async () => {
//         //     let demo1 = "0x1366e5a316508ddD62A0D605f3C3B94e57503779";
//         //     let demo2 = "0x85581377ad554EfD93dFFC6A4EBaDaeBBdB3796F";
//         //     assert.equal(demo1, user1);
//         //     assert.equal(demo2, user2);

//         //  });
//     });
// });

// //////////////////////////////////////////////////////////////////////////////////////

// contract('NFT Auction Test', async ([_owner, addr1, addr2]) => {

//     let nft,
//         marketPlace,
//         owner,
//         URI1, URI2,
//         tokenCount;

//     URI1 = "Sample URI";
//     URI2 = "URI Sample";
//     price = tokens('10');

//     function tokens(number) {
//         return web3.utils.toWei(number);
//     }



//     beforeEach(async () => {
//         nft = await NFT.new();
//         marketPlace = await Marketplace.new(1);

//         //Setting up Approval For Third Party Transfers.
//         await nft.setApprovalForAll(marketPlace.address, true, { from: addr1 });
//         await nft.setApprovalForAll(marketPlace.address, true, { from: addr2 });
//     });

//     it('NFT Auctioned Check To Our MarketPlace -> Checked', async () => {
//         let tokenUri, items, item;
//         //Minting NFT For User1
//         await nft.mint(URI1, { from: addr1 });
//         tokenCount = await nft.tokenCount();
//         await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr1 });
//         //Checking the Tokens URI
//         tokenUri = await nft.tokenURI(tokenCount.toString());
//         assert.equal(tokenUri, URI1);
//         //Checking the Owner Of the Account
//         assert.equal(await nft.ownerOf(tokenCount.toString()), marketPlace.address);
//         //Checking the Items field to Ensure Consistency 
//         item = await marketPlace.items(1);
//         assert.equal(item.itemid, 1);
//         assert.equal(item.nft, nft.address);
//         assert.equal(item.tokenId.toString(), tokenCount.toString());
//         assert.equal(item.price, price);
//         assert.equal(item.seller, addr1);
//         assert.equal(item.sold, false);

//         //Minting NFT For User2
//         await nft.mint(URI2, { from: addr2 });
//         //Getting the Token Count that is the Address of the Token
//         tokenCount = await nft.tokenCount();
//         await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr2 });
//         //Checking the Tokens URI
//         tokenUri = await nft.tokenURI(tokenCount.toString());
//         assert.equal(tokenUri, URI2);
//         //Checking the Owner Of the Account
//         assert.equal(await nft.ownerOf(tokenCount.toString()), marketPlace.address);
//         //Checking the Items field to Ensure Consistency 
//         item = await marketPlace.items(2);
//         assert.equal(item.itemid, 2);
//         assert.equal(item.nft, nft.address);
//         assert.equal(item.tokenId.toString(), tokenCount.toString());
//         assert.equal(item.price, price);
//         assert.equal(item.seller, addr2);
//         assert.equal(item.sold, false);


//         //Checking the Item Count in MarketPlace Using Expect
//         items = await marketPlace.itemCount();
//         expect(items.toString()).to.equal('2');

//         //Minting For More NFTs to check the Items Count in MarketPlace.
//         await nft.mint(URI2, { from: addr2 });
//         //Getting the Token Count that is the Address of the Token
//         tokenCount = await nft.tokenCount();
//         await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr2 });
//         //Checking the Item Count in MarketPlace Using Expect
//         items = await marketPlace.itemCount();
//         expect(items.toString()).to.equal('3');


//         //     //Event Check TBC
//         //     await nft.mint(URI1, {from: addr1 });
//         //     tokenCount = await nft.tokenCount();

//         //      await expect(await marketPlace.makeItem(nft.address, tokenCount, price, {from: addr1}))
//         //    const eventAuctioned = marketPlace.Auctioned (tokenCount,
//         //     nft.address,
//         //     tokenCount,
//         //     price,
//         //     addr1);
//         //     const { logs } = eventAuctioned;
//         //     assert.ok(Array.isArray(logs));
//         //     assert.equal(logs.length, 1);
//     });

//     it('If Price Less than 0 Reject-> Checked', async () => {
//         await nft.mint(URI1, { from: addr1 });
//         marketPlace = await Marketplace.new(1);
//         await nft.setApprovalForAll(marketPlace.address, true, { from: addr1 });
//         tokenCount = await nft.tokenCount();
//         price = tokens('0');
//         await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr2 }).should.be.rejected;

//     });

// });

///////////////////////////////////////////////////////////////////////////

contract('Item Purchase Functionality Tests ', async ([_owner, addr1, addr2, addr3]) => {
    let
        URI1 = "Sample URI",
        price = tokens('1'),
        tokenCount,
        feePercent = 1,
        fee = (feePercent / 100) * price,
        totalPrice;

    function tokens(number) {
        return web3.utils.toWei(number);
    }


    beforeEach(async () => {
        nft = await NFT.new();
        marketPlace = await Marketplace.new(1);

        //Setting up Approval For Third Party Transfers.
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr1 });
        await nft.setApprovalForAll(marketPlace.address, true, { from: addr2 });

        await nft.mint(URI1, { from: addr1 });
        tokenCount = await nft.tokenCount(); //Id of Recently Minted NFT
        await marketPlace.makeItem(nft.address, tokenCount, price, { from: addr1 });
    });

    it('The Inital/Final Balance of Seller/Marketplace ,Selling feature -> Checked', async () => {
        //Getting the inital balances of seller and marketplace.
        const sellerIntialBalance = await web3.eth.getBalance(addr1);
        const feeAccountIntialBalance = await web3.eth.getBalance(_owner);

        //Getting the TotalPrice of NFT with the Extra Fee For Transaction.
        totalPrice = await marketPlace.getTotalPrice(tokenCount); // i.e. tokenCount = 1; Only One NFT minted till now

        //Purchasing an NFT
        await marketPlace.purchaseItem(tokenCount, { value: totalPrice, from: addr2 });
        //Verifying the Owner Of NFT after Purchasing it.
        assert.equal(await nft.ownerOf(tokenCount.toString()), addr2);
        //NFT Status Check after being SOLD
        let item = await marketPlace.items(tokenCount);
        assert.equal(item.sold, true);

        //Getting the final balances of seller and marketplace after succesful selling of NFT
        const sellerFinalBalance = await web3.eth.getBalance(addr1);
        const feeAccountFinalBalance = await web3.eth.getBalance(_owner);
        //Evaluating New Seller Balance After Transaction to Compare with The sellerFinalBalance
        const newSellerBalance = parseInt(sellerIntialBalance) + parseInt(price);
        //Evaluating New MarketPlace Balance After Transaction to Compare with The feeAccountFinalBalance
        const newFeeAccoutBalance = parseInt(feeAccountIntialBalance) + parseInt(fee);
        // Verifying the Balance OF Buyer and Marketplace after Succesful Selling (transaction) of a NFT.
        assert.equal(sellerFinalBalance, newSellerBalance.toString());
        assert.equal(feeAccountFinalBalance, newFeeAccoutBalance.toString());
 });


    it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
        totalPrice = await marketPlace.getTotalPrice(tokenCount);
        //Checking for Unavailable NFT item id's.
        await marketPlace.purchaseItem(2, { value: totalPrice, from: addr2 }).should.be.rejected;
        await marketPlace.purchaseItem(0, { value: totalPrice, from: addr2 }).should.be.rejected;
        //Checking for Insufficient Payment.
        let lowPrice = tokens('2');
        await marketPlace.purchaseItem(0, { value: lowPrice, from: addr2 }).should.be.rejected;
        //Checking if already sold item can be purchased??
        await marketPlace.purchaseItem(1, { value: totalPrice, from: addr2 });
        await marketPlace.purchaseItem(1, { value: totalPrice, from: addr3}).should.be.rejected;

        

    });
});