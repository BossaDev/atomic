const {
    assert
} = require("chai");

// const ganacheUrl = "http://127.0.0.1:8545";
// let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// ganache-cli -d -f https://cloudflare-eth.com

const {
    startChain,
    deployAtomicFactory
} = require("./testHelpers")

// encoder from the block
let encoder = function (value, unit, to) {

    return {
        adds: [to],
        values: [ethers.utils.parseUnits(value, unit).toString()],
        datas: ["0x0"]
    }
}

describe("ETH Transfer", function () {
    it("Should transfer Ether", async function () {
        this.timeout(50000);

        ethers.provider = await startChain();
        const signer = ethers.provider.getSigner(0);

        // const atomicFactory = deployAtomicFactory()
        const AtomicFactory = await ethers.getContractFactory("Atomic");
        atomicFactory = await AtomicFactory.deploy("0x608060405234801561001057600080fd5b50326000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610261806100a16000396000f3fe60806040526004361061002d5760003560e01c80638da5cb5b146100d6578063c45a01551461010157610034565b3661003457005b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000366040516100809291906101ab565b600060405180830381855af49150503d80600081146100bb576040519150601f19603f3d011682016040523d82523d6000602084013e6100c0565b606091505b50509050806100d3573d6000803e3d6000fd5b50005b3480156100e257600080fd5b506100eb61012c565b6040516100f891906101c4565b60405180910390f35b34801561010d57600080fd5b50610116610151565b60405161012391906101c4565b60405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610180816101ea565b82525050565b600061019283856101df565b935061019f83858461021c565b82840190509392505050565b60006101b8828486610186565b91508190509392505050565b60006020820190506101d96000830184610177565b92915050565b600081905092915050565b60006101f5826101fc565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b8281833760008383015250505056fea2646970667358221220c253016a11ae1443c02efb8b31dda0cfddbb78ad730435d35658bfcc9e0b81c664736f6c63430006080033");

        let txs = [
            ["1", "ether", "0x12C4914c27B8A9A038E16104d06e8679c4eD8Dc6"],
            ["20000000", "wei", "0xaAF6da1c0e9CF6Fc7F18C5d648337e32EFbdE718"],
            ["300", "gwei", "0xC69E1e6E3A8296Bb1b21158bA0C6c3447F5339e5"]
        ]

        txObj = {
            adds: [],
            values: [],
            datas: []
        }
        let previousBalances = []

        for (i = 0; i < txs.length; i++) {
            previousBalances[i] = await ethers.provider.getBalance(txs[i][2])
            txData = encoder(...txs[i])
            txObj.adds.push(txData.adds[0])
            txObj.values.push(txData.values[0])
            txObj.datas.push(txData.datas[0])
        }

        await atomicFactory.launchAtomic(
            txObj.adds,
            txObj.values,
            txObj.datas, {
                value: ethers.utils.parseUnits("2", "ether").toHexString(),
                gasPrice: 1,
                gasLimit: 6500000,
            }
        );

        for (i = 0; i < txs.length; i++) {
            currentBalance = await ethers.provider.getBalance(txs[i][2])
            assert.equal(previousBalances[i].add(ethers.utils.parseUnits(txs[i][0], txs[i][1])).toString(), currentBalance.toString())
        }
    });
});