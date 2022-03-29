// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount; //the account that receives fee for the transaction made. i.e the owner.
    uint256 public immutable feePercent; // the fee commission percentage on sales
    uint256 public itemCount;

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    struct Item {
        uint256 itemid;
        IERC721 nft; // Instance Of NFT contract associated with it.
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => Item) public items;

    event Auctioned(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    //Function to Auction An NFT.
    function makeItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");

        //Number of items increased.
        itemCount++;

        //transfer nft to Marketplace.
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        //Adding New Item to The Available Items List.
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        //BroadCasting the Auctioned Event For New NFT.
        emit Auctioned(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    //Function to Buy an NFT.
    function purchaseItem(uint256 _itemId) external payable nonReentrant {
      //Getting the totalprice
        uint256 totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId]; // Item storage defines the current storage Item; not new Copy oF Item struct.
        //Setting up restrictions
        require(
            _itemId > 0 && _itemId <= itemCount,
            "The NFT Doesn't Exists.."
        );
        require(
            msg.value >= totalPrice,
            "Not Enough Amount For The Transaction"
        );
        require(!item.sold, "This NFT is already Sold");
        // Transfer coins to Seller and ..
        item.seller.transfer(item.price);
       //Transfer Commission to The MarketPlace
        feeAccount.transfer(totalPrice - item.price);
        //Update the Sold NFT Status.
        item.sold = true;
        //Tranfer the NFT to the Buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        //Emittig the Event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    //Evaluating the Total Price of NFT Including the Fee for Transaction 
    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
