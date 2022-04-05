// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ERC1155Receiver, ReentrancyGuard {
    address payable public immutable feeAccount; //the account that receives fee for the transaction made. i.e the owner.
    uint256 public immutable feePercent; // the fee commission percentage on sales
    uint256 public itemCount;
    uint256 public itemCount1155;

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    struct Item {
        uint256 itemid;
        IERC721 nft; // Instance Of NFT contract associated with it.
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }
    struct Item1155 {
        uint256 itemid;
        IERC1155 nft; // Instance Of NFT contract associated with it.
        uint256 amount;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => Item) public items;
    mapping(uint256 => Item1155) public items1155;

    event Auctioned(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    event Auctioned1155(
        uint256 itemId,
        address indexed nft,
        uint256 amount,
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
    event Bought1155(
        uint256 itemId,
        address indexed nft,
        uint256 amount,
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

    //Funtion to Auction an NFT1155.
    function makeItem1155(
        IERC1155 _nft,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        require(_amount > 0, "Amount must be greater than zero");

        //Number of items increased.
        itemCount1155++;

        //transfer nft to Marketplace.
        _nft.safeTransferFrom(
            msg.sender, //"from" address -> must approve the -> "to" address...
            address(this),
            _tokenId,
            _amount,
            "0x0"
        );

        //Adding New Item to The Available Items List.
        items1155[itemCount1155] = Item1155(
            itemCount1155,
            _nft,
            _amount,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        //BroadCasting the Auctioned Event For New NFT.
        emit Auctioned1155(
            itemCount1155,
            address(_nft),
            _amount,
            _tokenId,
            _price,
            msg.sender
        );
    }

    //Function to Buy NFT1155
    function purchaseItem1155(uint256 _itemId, uint256 _amount)
        external
        payable
        nonReentrant
    {
        //Getting the totalprice
        uint256 totalPrice = getTotalPrice1155(_itemId, _amount);
        Item1155 storage item = items1155[_itemId]; // Item storage defines the current storage Item; not new Copy oF Item struct.
        //Setting up restrictions
        require(
            _itemId > 0 && _itemId <= itemCount1155,
            "The NFT1155 Doesn't Exists.."
        );
        require(
            _amount > 0 && _amount <= item.amount,
            "The NFT1155 Doesn't Exists.."
        );
        require(
            msg.value >= totalPrice,
            "Not Enough Amount For The Transaction"
        );
        require(!item.sold, "This NFT1155 is already Sold");
        // Transfer coins to Seller and ..
        uint256 itemPrice = item.price * _amount;
        item.seller.transfer(itemPrice);
        //Transfer Commission to The MarketPlace
        feeAccount.transfer(totalPrice - itemPrice);
        //Update the Sold NFT Status.
        item.amount = item.amount - _amount; //updating the no. of available NFTs for the particular token Id.
        if (item.amount > 0) {
            item.sold = false;
        } else {
            item.sold = true;
        }

        //Tranfer the NFT to the Buyer
        item.nft.safeTransferFrom(
            address(this),
            msg.sender,
            item.tokenId,
            _amount,
            "0x0"
        );
        //Emittig the Event
        emit Bought1155(
            _itemId,
            address(item.nft),
            _amount,
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    //Evaluating the Total Price of NFT Including the Fee for Transaction
    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }

    //Evaluating the Total Price of NFT1155 Including the Fee for Transaction
    function getTotalPrice1155(uint256 _itemId, uint256 _amount)
        public
        view
        returns (uint256)
    {
        return ( ( (items1155[_itemId].price * _amount) * (100 + feePercent) ) / 100);
    }
}
