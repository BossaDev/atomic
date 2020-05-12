const {
    assert
} = require("chai");

var ethers = require("ethers");

const ganacheUrl = "http://127.0.0.1:8545";
let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// ganache-cli -d -f https://cloudflare-eth.com

const {
    startChain,
    deployAtomic
} = require("./testHelpers")

// encoder from the block
let encoder = function (value, unit, to) {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, [to, ethers.utils.parseUnits(value, unit).toString(), "0x0"]).slice(2);
}


describe("ETH Transfer", function () {
    it("Should transfer Ether", async function () {
        this.timeout(50000);

        const provider = await startChain();
        const signer = provider.getSigner(0);

        let txs = [
            ["1", "ether", "0x12C4914c27B8A9A038E16104d06e8679c4eD8Dc6"],
            ["20000000", "wei", "0xaAF6da1c0e9CF6Fc7F18C5d648337e32EFbdE718"],
            ["300", "gwei", "0xC69E1e6E3A8296Bb1b21158bA0C6c3447F5339e5"]
        ]

        let payload = "0x"

        let previousBalances = []

        for (i = 0; i < 3; i++) {
            previousBalances[i] = await provider.getBalance(txs[i][2])
            payload += encoder(txs[i][0], txs[i][1], txs[i][2])
        }

        // atomic launch with payload, value in Eth
        await deployAtomic(payload, signer, "2")

        for (i = 0; i < 3; i++) {
            currentBalance = await provider.getBalance(txs[i][2])
            assert.equal(previousBalances[i].add(ethers.utils.parseUnits(txs[i][0], txs[i][1])).toString(), currentBalance.toString())
        }
    });
});