const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0xEBc1c15FEC60437bCd369B22f6E585aD0C1558DE"; //
	let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY); //
	let serial = 0;
	let maxQuantity = 2;
	let addressForClaim = ['0xdc41cde0eb46fd1a75040bcdd8ed8df045e28c20'];


	for (let i = 0; i < addressForClaim.length; i++) {
		const domain = {
			name: 'LION DAO',
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

		var creat = await adminClient.query(q.Create(q.Ref(q.Collection('Claim'), serial + i), {
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