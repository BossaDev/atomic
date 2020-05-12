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

// start chain forking mainnet on recent block
const startChain = async () => {

    const ganache = Ganache.provider({
        fork: MAINNET_NODE_URL,
        network_id: 1,
        fork_block_number: (await getLatestBlock()) - 10, // forking 10 blocks behind to avoid bumping into sync differences
    })

    const provider = new ethers.providers.Web3Provider(ganache)
    return provider
}

// swap value (in eth) for dai to enable testing of blocks that require erc20 tokens, returns payload of swap
const swapEthForDai = async function (value) {
    let uniswapExchangeInterface = new ethers.utils.Interface(legos.uniswap.exchange.abi);

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    let exchange = "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667" // hardcoded dai exchange

    let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode(["2", Math.floor(Date.now() / 1000) + 300])
    return encoder.encode(types, [exchange, ethers.utils.parseEther(value), calldata]).slice(2)
}

const atomicAbi = [{
    "inputs": [{
        "internalType": "bytes",
        "name": "transactions",
        "type": "bytes"
    }],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
}]
const atomicBytecode = "0x60806040526040516101a63803806101a68339818101604052602081101561002657600080fd5b810190808051604051939291908464010000000082111561004657600080fd5b8382019150602082018581111561005c57600080fd5b825186600182028301116401000000008211171561007957600080fd5b8083526020830192505050908051906020019080838360005b838110156100ad578082015181840152602081019050610092565b50505050905090810190601f1680156100da5780820380516001836020036101000a031916815260200191505b50604052505050805160205b8181101561015757808301516020820184015160608301850151608084018601600080838386885af1600081141561013d577f4f6e65206f6620746865207472616e73616374696f6e73206661696c656400006000fd5b602080601f850104026080018601955050505050506100e6565b505050603e806101686000396000f3fe6080604052600080fdfea265627a7a72315820312ba706d4dbedb280f08c03c60f5839a8e73114f190dc9b8bbc7c7b2059b18964736f6c634300050f0032"

// atomic launch with payload, value in Eth
const deployAtomic = async (payload, signer, value = "0") => {
    let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);
    let atomicContract = await factory.deploy(payload, {
        value: ethers.utils.parseUnits(value, "ether").toHexString(),
        gasPrice: 1,
        gasLimit: 6721975
    });
    return atomicContract
}

module.exports = {
    atomicAbi: atomicAbi,
    atomicBytecode: atomicBytecode,
    startChain: startChain,
    swapEthForDai: swapEthForDai,
    deployAtomic: deployAtomic
}