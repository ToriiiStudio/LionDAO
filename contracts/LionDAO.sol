// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './ERC721B.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

//  _     ___   ___   _  _       ___     _     ___
// | |   |_ _| / _ \ | \| |     |   \   /_\   / _ \
// | |__  | | | (_) || .` |     | |) | / _ \ | (_) |
// |____||___| \___/ |_|\_|     |___/ /_/ \_\ \___/


contract LionDAO is Ownable, EIP712, ERC721B {

	using SafeMath for uint256;
	using Strings for uint256;

	// Sales variables
	// ------------------------------------------------------------------------
	uint public MAX_LION = 999;
	uint public STAGE_LIMIT = 333;
	uint public PRICE = 2 ether;
	uint public numWhitelistSale = 0;
	uint public numClaim = 0;
	uint public numGiveaway = 0;
	uint public totalSupply = 0;
	bool public hasWhitelistSaleStarted = true; //
	bool public hasClaimStarted = false; //
	string private _baseTokenURI = "http://api.lion/Metadata/"; //
	address public treasury = 0x5279246E3626Cebe71a4c181382A50a71d2A4156; //

	mapping (address => uint256) public hasMinted;

    uint256 public whitelistSaleTimestamp = 1646719200; // 

	// Events
	// ------------------------------------------------------------------------
	event mintEvent(address owner, uint256 quantity, uint256 totalSupply);
	
	// Constructor
	// ------------------------------------------------------------------------
	constructor()
	EIP712("LION DAO", "1.0.0")  
	ERC721B("LION DAO", "LION"){}

    // Modifiers
    // ------------------------------------------------------------------------
    modifier onlyWhitelistSale() {
		require(hasWhitelistSaleStarted == true, "WHITELIST_NOT_ACTIVE");
        require(block.timestamp >= whitelistSaleTimestamp, "NOT_IN_WHITELIST_TIME");
        _;
    }

	// Verify functions
	// ------------------------------------------------------------------------
	function verify(uint256 maxQuantity, bytes memory SIGNATURE) public view returns (bool){
		address recoveredAddr = ECDSA.recover(_hashTypedDataV4(keccak256(abi.encode(keccak256("NFT(address addressForClaim,uint256 maxQuantity)"), _msgSender(), maxQuantity))), SIGNATURE);

		return owner() == recoveredAddr;
	}

	// Claim functions
	// ------------------------------------------------------------------------
	function claimLion(uint256 quantity, uint256 maxQuantity, bytes memory SIGNATURE) external {
		require(hasClaimStarted == true, "Claim hasn't started.");
		require(totalSupply.add(quantity) <= STAGE_LIMIT, "This stage is sold out!");
		require(verify(maxQuantity, SIGNATURE), "Not eligible for claim.");
		require(quantity > 0 && hasMinted[msg.sender].add(quantity) <= maxQuantity, "Exceed the quantity that can be claimed");
		require(totalSupply.add(quantity) <= MAX_LION, "Exceeds MAX_LION.");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(msg.sender, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numClaim = numClaim.add(quantity);
		hasMinted[msg.sender] = hasMinted[msg.sender].add(quantity);

		emit mintEvent(msg.sender, quantity, totalSupply);
	}

	// Whitelist functions
	// ------------------------------------------------------------------------
	function mintWhitelistLion(uint256 quantity, uint256 maxQuantity, bytes memory SIGNATURE) external payable onlyWhitelistSale{
		require(totalSupply.add(quantity) <= STAGE_LIMIT, "This stage is sold out!");
		require(verify(maxQuantity, SIGNATURE), "Not eligible for whitelist.");
		require(quantity > 0 && hasMinted[msg.sender].add(quantity) <= maxQuantity, "Exceeds max whitelist number.");
		require(totalSupply.add(quantity) <= MAX_LION, "Exceeds MAX_LION.");
		require(msg.value == PRICE.mul(quantity), "Ether value sent is not equal the price.");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(msg.sender, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numWhitelistSale = numWhitelistSale.add(quantity);
		hasMinted[msg.sender] = hasMinted[msg.sender].add(quantity);

		emit mintEvent(msg.sender, quantity, totalSupply);
	}

	// Giveaway functions
	// ------------------------------------------------------------------------
	function giveawayLion(address _to, uint256 quantity) external onlyOwner{
		require(totalSupply.add(quantity) <= MAX_LION, "Exceeds MAX_LION.");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(_to, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numGiveaway = numGiveaway.add(quantity);
		emit mintEvent(_to, quantity, totalSupply);
	}

	// Base URI Functions
	// ------------------------------------------------------------------------
	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "TOKEN_NOT_EXISTS");
		
		return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
	}

    // Burn Functions
    // ------------------------------------------------------------------------
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

	// setting functions
	// ------------------------------------------------------------------------
	function setURI(string calldata _tokenURI) external onlyOwner {
		_baseTokenURI = _tokenURI;
	}

	function setSTAGE_LIMIT(uint _STAGE_LIMIT) external onlyOwner {
		STAGE_LIMIT = _STAGE_LIMIT;
	}

	function setMAX_LION(uint _MAX_num) external onlyOwner {
		MAX_LION = _MAX_num;
	}

	function set_PRICE(uint _price) external onlyOwner {
		PRICE = _price;
	}

    function setWhitelistSale(bool _hasWhitelistSaleStarted,uint256 _whitelistSaleTimestamp) external onlyOwner {
        hasWhitelistSaleStarted = _hasWhitelistSaleStarted;
        whitelistSaleTimestamp = _whitelistSaleTimestamp;
    }

	function setClaim(bool _hasClaimStarted) external onlyOwner {
		hasClaimStarted = _hasClaimStarted;
	}

	// Withdrawal functions
	// ------------------------------------------------------------------------
    function setTreasury(address _treasury) external onlyOwner {
        require(treasury != address(0), "SETTING_ZERO_ADDRESS");
        treasury = _treasury;
    }

	function withdrawAll() public payable onlyOwner {
		require(payable(treasury).send(address(this).balance));
	}
}
  