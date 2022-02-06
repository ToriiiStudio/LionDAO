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

		it("giveawayLion Function", async function () {

			await contract.connect(owner).giveawayLion(addr2.address, 2);
			expect(await contract.totalSupply()).to.equal(2);

		});

		it("claimLion Function", async function () {

			let quantity = 5;
			let maxQuantity = 10;

			const domain = {
				name: 'LION DAO',
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

			const value = {
				addressForClaim: addr2.address,
				maxQuantity: 10
			};

			signature = await owner._signTypedData(domain, types, value);
			console.log(signature)
			await contract.connect(addr2).claimLion(quantity, maxQuantity, signature);

		});

		it("mintWhitelistLion Function", async function () {

			let quantity = 1;
			let maxQuantity = 1;

			const domain = {
				name: 'LION DAO',
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
				maxQuantity: 1
			};

			signature = await owner._signTypedData(domain, types, value);

			await contract.connect(addr1).mintWhitelistLion(quantity, maxQuantity, signature, {value: "900000000000000000"});

		
		});


		it("withdrawAll Function", async function () {

			await contract.connect(owner).withdrawAll();

		});
	});
});