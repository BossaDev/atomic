const {
    expect,
    assert
} = require("chai");

const ethers = require("ethers");
const {
    legos
} = require("@studydefi/money-legos")

const ganacheUrl = "http://127.0.0.1:8545";
let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// ganache-cli -d -f https://cloudflare-eth.com

const signer = provider.getSigner(0);

let atomicAbi = [{
    "inputs": [{
        "internalType": "bytes",
        "name": "transactions",
        "type": "bytes"
    }],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
}]
let atomicBytecode = "0x60806040526040516101a63803806101a68339818101604052602081101561002657600080fd5b810190808051604051939291908464010000000082111561004657600080fd5b8382019150602082018581111561005c57600080fd5b825186600182028301116401000000008211171561007957600080fd5b8083526020830192505050908051906020019080838360005b838110156100ad578082015181840152602081019050610092565b50505050905090810190601f1680156100da5780820380516001836020036101000a031916815260200191505b50604052505050805160205b8181101561015757808301516020820184015160608301850151608084018601600080838386885af1600081141561013d577f4f6e65206f6620746865207472616e73616374696f6e73206661696c656400006000fd5b602080601f850104026080018601955050505050506100e6565b505050603e806101686000396000f3fe6080604052600080fdfea265627a7a72315820312ba706d4dbedb280f08c03c60f5839a8e73114f190dc9b8bbc7c7b2059b18964736f6c634300050f0032"
let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);

// encoder from the block
let encoder = async function (value, tokenFrom, tokenTo) {
    if (tokenFrom == tokenTo) {
        console.log("Error (uniswap_v1_swap): Cannot swap for the same token, please use different tokens from/to.")
        return
    }

    // uniswap factory (to find out exchanges for tokens)
    let uniswapTestFactory = new ethers.Contract(legos.uniswap.factory.address, legos.uniswap.factory.abi, signer);

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

        let daiContract = new ethers.Contract(legos.erc20.dai.address, legos.erc20.abi, signer);
        let wbtcContract = new ethers.Contract(legos.erc20.wbtc.address, legos.erc20.abi, signer);

        let previousEthBalance = await signer.getBalance()

        // all three types of transactions will be fired at once, to speed up testing and keep things atomic style
        let payload = "0x"
        payload += await encoder("1", "0x0", legos.erc20.dai.address)
        payload += await encoder("5", legos.erc20.dai.address, "0x0")
        payload += await encoder("5", legos.erc20.dai.address, legos.erc20.wbtc.address)

        // atomic launch with payload
        let atomicContract = await factory.deploy(payload, {
            value: ethers.utils.parseUnits("2", "ether").toHexString(),
            gasPrice: 1,
            gasLimit: 6721975
        });

        let currentEthBalance = await signer.getBalance()
        let daiBalance = await daiContract.balanceOf(atomicContract.address)
        let wbtcBalance = await wbtcContract.balanceOf(atomicContract.address)

        assert(currentEthBalance.lt(previousEthBalance), 'ETH was not spent');
        assert(daiBalance.gt(0), 'DAI not swapped');
        assert(wbtcBalance.gt(0), 'WBTC not swapped');
    });
});