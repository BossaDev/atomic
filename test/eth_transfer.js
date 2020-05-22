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
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return { adds: [to], values: [ethers.utils.parseUnits(value, unit).toString()], datas: ["0x0"] }
}


describe("ETH Transfer", function () {
    it("Should transfer Ether", async function () {
        this.timeout(50000);

        ethers.provider = await startChain();
        const signer = ethers.provider.getSigner(0);

        // const atomicFactory = deployAtomicFactory()
        const AtomicFactory = await ethers.getContractFactory("Atomic");
        atomicFactory = await AtomicFactory.deploy();

        let txs = [
            ["1", "ether", "0x12C4914c27B8A9A038E16104d06e8679c4eD8Dc6"],
            ["20000000", "wei", "0xaAF6da1c0e9CF6Fc7F18C5d648337e32EFbdE718"],
            ["300", "gwei", "0xC69E1e6E3A8296Bb1b21158bA0C6c3447F5339e5"]
        ]

        txObj = { adds: [], values: [], datas: []}
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
            txObj.datas,
            {
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