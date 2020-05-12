const {
    assert
} = require("chai");

const ethers = require("ethers");
const {
    legos
} = require("@studydefi/money-legos")

const {
    startChain,
    deployAtomic,
    swapEthForDai
} = require("./testHelpers")

// encoder from the block
let encoder = async function (value, tokenFrom, tokenTo) {
    if (tokenFrom == tokenTo) {
        console.log("Error (uniswap_v1_swap): Cannot swap for the same token, please use different tokens from/to.")
        return
    }

    // uniswap factory (to find out exchanges for tokens)
    let uniswapTestFactory = new ethers.Contract(legos.uniswap.factory.address, legos.uniswap.factory.abi, new ethers.getDefaultProvider());

    // gets 
    let getExchange = async (tokenAddress) => {
        let exchangeAddress = await uniswapTestFactory.getExchange(tokenAddress)
        return exchangeAddress
    }

    let uniswapExchangeInterface = new ethers.utils.Interface(legos.uniswap.exchange.abi);
    let erc20Interface = new ethers.utils.Interface(legos.erc20.abi)

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    let exchange = (tokenFrom == "0x0") ? await getExchange(tokenTo) : await getExchange(tokenFrom)

    if (tokenFrom == "0x0") { // from ether to token

        let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode(["2", Math.floor(Date.now() / 1000) + 300])
        return encoder.encode(types, [exchange, ethers.utils.parseEther(value), calldata]).slice(2)

    } else {

        let aproveCalldata = erc20Interface.functions.approve.encode([exchange, ethers.utils.parseEther(value)])
        let swapCalldata

        if (tokenTo == "0x0") { // from token to ether
            swapCalldata = uniswapExchangeInterface.functions.tokenToEthSwapInput.encode([ethers.utils.parseEther(value), "1", Math.floor(Date.now() / 1000) + 300])
        } else { // token to token
            swapCalldata = uniswapExchangeInterface.functions.tokenToTokenSwapInput.encode([ethers.utils.parseEther(value), "1", "1", Math.floor(Date.now() / 1000) + 300, tokenTo])
        }

        return encoder.encode(types, [tokenFrom, "0", aproveCalldata]).slice(2) + encoder.encode(types, [exchange, "0", swapCalldata]).slice(2)

    }
}

describe("Uniswap V1 Swap", function () {

    it("Should swap", async function () {
        this.timeout(100000);

        const provider = await startChain();
        const signer = provider.getSigner(0);

        let daiContract = new ethers.Contract(legos.erc20.dai.address, legos.erc20.abi, signer);
        let wbtcContract = new ethers.Contract(legos.erc20.wbtc.address, legos.erc20.abi, signer);

        let previousEthBalance = await signer.getBalance()

        // all three types of transactions will be fired at once, to speed up testing and keep things atomic style
        let payload = "0x"
        payload += await encoder("1", "0x0", legos.erc20.dai.address)
        payload += await encoder("5", legos.erc20.dai.address, "0x0")
        payload += await encoder("5", legos.erc20.dai.address, legos.erc20.wbtc.address)

        // atomic launch with payload, value in Eth
        let atomicContract = await deployAtomic(payload, signer, "2")

        let currentEthBalance = await signer.getBalance()
        let daiBalance = await daiContract.balanceOf(atomicContract.address)
        let wbtcBalance = await wbtcContract.balanceOf(atomicContract.address)

        assert(currentEthBalance.lt(previousEthBalance), 'ETH was not spent');
        assert(daiBalance.gt(0), 'DAI not swapped');
        assert(wbtcBalance.gt(0), 'WBTC not swapped');
    });
});