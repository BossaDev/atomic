const {
    assert
} = require("chai");

const ethers = require("ethers");

const {
    startChain,
    deployAtomic,
    swapEthForDai
} = require("./testHelpers")

const {
    legos
} = require("@studydefi/money-legos");

// encoder from the block
let encoder = function (value, tokenAddress, to) {
    let erc20Interface = new ethers.utils.Interface(legos.erc20.abi)
    let calldata = erc20Interface.functions.transfer.encode([to, ethers.utils.parseEther(value)])

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, [tokenAddress, "0", calldata]).slice(2);
}

describe("ERC20 Transfer", function () {
    it("Should transfer ERC20 token", async function () {
        this.timeout(100000);

        const provider = await startChain();
        const signer = provider.getSigner(0);

        let daiContract = new ethers.Contract(legos.erc20.dai.address, legos.erc20.abi, signer);

        let txs = [
            ["10", legos.erc20.dai.address, "0x12C4914c27B8A9A038E16104d06e8679c4eD8Dc6"],
            ["20", legos.erc20.dai.address, "0xaAF6da1c0e9CF6Fc7F18C5d648337e32EFbdE718"],
            ["30", legos.erc20.dai.address, "0xC69E1e6E3A8296Bb1b21158bA0C6c3447F5339e5"]
        ]

        let payload = "0x"

        // swapping 1 eth for dai to enable testing (uniswap)
        payload += await swapEthForDai("1")

        // encoding and collecting current dai balances
        for (i = 0; i < txs.length; i++) {
            payload += await encoder(txs[i][0], txs[i][1], txs[i][2])
        }

        // atomic launch with payload, value in Eth
        await deployAtomic(payload, signer, "2")

        // encoding and collecting current dai balances
        for (i = 0; i < txs.length; i++) {
            // payload += await encoder (txs[i][0], txs[i][1], txs[i][2])
            let currentDaiBalance = await daiContract.balanceOf(txs[i][2])
            assert.equal(ethers.utils.parseEther(txs[i][0]).toString(), currentDaiBalance.toString())
        }
    });
});