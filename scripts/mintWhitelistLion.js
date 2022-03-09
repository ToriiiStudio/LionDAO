// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const NFT = artifacts.require("LionDAO");

async function main() {

  let nftAddress = "0xEBc1c15FEC60437bCd369B22f6E585aD0C1558DE";
  let nft = await NFT.at(nftAddress);
  // let chainId = await ethers.provider.getNetwork()
  let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
  let quantity = 1;
  let maxClaimNum = 20;

  const domain = {
    name: 'LIONDAO',
    version: '1.0.0',
    chainId: 4,
    verifyingContract: nftAddress
  };

  const types = {
    NFT: [
        { name: 'addressForClaim', type: 'address' },
        { name: 'maxQuantity', type: 'uint256' },
    ],
  };

  const value = { addressForClaim: "0x5279246E3626Cebe71a4c181382A50a71d2A4156", maxQuantity: 20};

  signature = await owner._signTypedData(domain, types, value);
  console.log(signature);

  await nft.mintWhitelistLion(quantity, maxClaimNum, signature, {value: "900000000000000000"});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
