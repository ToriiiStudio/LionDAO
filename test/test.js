const {
	assert,
	expect
} = require('chai');
const {
	BN,
	time,
	expectRevert,
	constants,
	balance
} = require('@openzeppelin/test-helpers');
const {
	artifacts,
	ethers
} = require('hardhat');

describe("LionDAO", function () {

	let Token;
	let contract;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	before(async function () {

		Token = await ethers.getContractFactory("LionDAO");
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();

		contract = await Token.deploy();
		console.log("LionDAO deployed to:", contract.address);

	});

	describe("LionDAO Test", function () {

		// it("giveawayLion Function", async function () {

		// 	await contract.connect(owner).giveawayLion(addr2.address, 1);
		// 	expect(await contract.totalSupply()).to.equal(1);
		// });

		// it("claimLion Function", async function () {

		// 	await contract.connect(owner).setClaim(1);
		// 	await contract.connect(owner).setSTAGE_LIMIT(500);

		// 	let quantity = 500;
		// 	let maxQuantity = 999;

		// 	const domain = {
		// 		name: 'LIONDAO',
		// 		version: '1.0.0',
		// 		chainId: 31337,
		// 		verifyingContract: '0x668eD30aAcC7C7c206aAF1327d733226416233E2'
		// 	};

		// 	const types = {
		// 		NFT: [{
		// 				name: 'addressForClaim',
		// 				type: 'address'
		// 			},
		// 			{
		// 				name: 'maxQuantity',
		// 				type: 'uint256'
		// 			},
		// 		],
		// 	};

		// 	const value = {
		// 		addressForClaim: addr2.address,
		// 		maxQuantity: maxQuantity
		// 	};

		// 	signature = await owner._signTypedData(domain, types, value);
		// 	console.log(signature)
		// 	await contract.connect(addr2).claimLion(quantity, maxQuantity, signature);

		// });

		it("mintWhitelistLion Function", async function () {

			expect(await contract.totalSupply()).to.equal(101);

			let quantity = 2;
			let maxQuantity = 2;

			const domain = {
				name: 'LIONDAO',
				version: '1.0.0',
				chainId: 31337,
				verifyingContract: '0x668eD30aAcC7C7c206aAF1327d733226416233E2'
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

			var value = {
				addressForClaim: addr1.address,
				maxQuantity: maxQuantity
			};

			signature = await owner._signTypedData(domain, types, value);

			await contract.connect(addr1).mintWhitelistLion(quantity, maxQuantity, signature, {value: "1600000000000000000"});

			expect(await contract.totalSupply()).to.equal(103);

		});

		// it("Setting Function", async function () {
		// 	await contract.connect(owner).setURI("Test");
		// 	console.log(await contract.connect(owner).tokenURI(0));

		// });

		// it("withdrawAll Function", async function () {
			
			// await contract.connect(owner).setTreasury("0x5279246E3626Cebe71a4c181382A50a71d2A4156");
			// await contract.connect(owner).withdrawAll();

		// });
	});
});