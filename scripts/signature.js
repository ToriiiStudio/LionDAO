const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0xD356DE76AC911C226C8A3196E1b1E716045582B2";
	let owner = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY); 
	let serial = 0;  // ok
	let maxQuantity = 2;
	let userAddress = ['0xd56e7bcF62a417b821e6cf7ee16dF7715a3e82AB', '0xd56e7bcF62a417b821e6cf7ee16dF7715a3e82AB'];
	let addressForClaim = [];

	// Convert address to lower case.
	for (let i = 0; i < userAddress.length; i++) {
		let lowerUserAddress = userAddress[i].toLowerCase();
		addressForClaim.push(lowerUserAddress);
	}

	// Search the last faunaDB id
	for (let i = 0; i < 10000; i++) {
		try {
			result = await adminClient.query(q.Get(q.Ref(q.Collection("Whitelist"), i)))
		  } catch (error) {
			serial = i
			break;
		  }
	}

	// Signature
	for (let i = 0; i < addressForClaim.length; i++) {
		const domain = {
			name: 'LIONDAO',
			version: '1.0.0',
			chainId: 1,
			verifyingContract: nftAddress
		};

		const types = {
			NFT: [{
					name: 'addressForClaim',
					type: 'address'
				},
				{
					name: 'maxQuantity',
					type: 'uint256'
				},
			],
		};

		const value = {
			addressForClaim: addressForClaim[i],
			maxQuantity: maxQuantity
		};

		signature = await owner._signTypedData(domain, types, value);
		console.log(signature);

		// Update to faunaDB
		var creat = await adminClient.query(q.Create(q.Ref(q.Collection('Whitelist'), serial + i), {
			data: {
				address: addressForClaim[i],
				maxNum: maxQuantity,
				signature: signature
			}
		}));

		console.log(creat);	
	}
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});