const {
    expect,
    assert
} = require("chai");

var ethers = require("ethers");

// encoder from the block
let encoder = function (value, unit, to) {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, [to, ethers.utils.parseUnits(value,unit).toString(), "0x0"]).slice(2);
}

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


describe("Eth_Transfer", function () {
    it("Should transfer ether", async function () {

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

        // atomic launch with payload
        let contract = await factory.deploy(payload, {
            value: ethers.utils.parseUnits("2", "ether").toHexString(),
            gasPrice: 1,
            gasLimit: 6721975
        });

        // console.log("Depdloyed at", contract.address);
        // console.log("Tx Hash", contract.deployTransaction.hash);

        for (i = 0; i < 3; i++) {
            currentBalance = await provider.getBalance(txs[i][2])
            assert.equal(previousBalances[i].add(ethers.utils.parseUnits(txs[i][0],txs[i][1])).toString(), currentBalance.toString())
        }
    });
});