const {
    expect,
    assert
} = require("chai");

const ethers = require("ethers");
const Ganache = require("ganache-core")

const {
    legos
} = require("@studydefi/money-legos");

const MAINNET_NODE_URL = "https://cloudflare-eth.com"

const getLatestBlock = async () => {
    let provider = new ethers.getDefaultProvider();
    return await provider.getBlockNumber()
}

const startChain = async () => {

    const ganache = Ganache.provider({
        fork: MAINNET_NODE_URL,
        network_id: 1,
        fork_block_number: (await getLatestBlock()) - 5, // forking 10 blocks behind to avoid bumping into sync differences
    })

    const provider = new ethers.providers.Web3Provider(ganache)
    return provider
}

const swapEthForDai = async function (value) {
    let uniswapExchangeInterface = new ethers.utils.Interface(legos.uniswap.exchange.abi);

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    let exchange = "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667" // hardcoded dai exchange

    let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode(["2", Math.floor(Date.now() / 1000) + 300])
    return encoder.encode(types, [exchange, ethers.utils.parseEther(value), calldata]).slice(2)
}

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

        let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);
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

        // atomic launch with payload
        let atomicContract = await factory.deploy(payload, {
            value: ethers.utils.parseUnits("2", "ether").toHexString(),
            gasPrice: 1,
            gasLimit: 6721975
        });

        // encoding and collecting current dai balances
        for (i = 0; i < txs.length; i++) {
            // payload += await encoder (txs[i][0], txs[i][1], txs[i][2])
            let currentDaiBalance = await daiContract.balanceOf(txs[i][2])
            assert.equal(ethers.utils.parseEther(txs[i][0]).toString(), currentDaiBalance.toString())
        }
    });
});