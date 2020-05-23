const {
    assert
} = require("chai");

const {
    startChain,
    swapEthForDai,
    mergeTxObjs
} = require("./testHelpers")

const {
    legos
} = require("@studydefi/money-legos");

// encoder from the block
let encoder = function (value, tokenAddress, to) {

    let erc20TransferAbi = [{
        "constant": false,
        "inputs": [{
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    let erc20Interface = new ethers.utils.Interface(erc20TransferAbi)
    let calldata = erc20Interface.functions.transfer.encode([to, ethers.utils.parseEther(value)])

    return {
        adds: [tokenAddress],
        values: ["0"],
        datas: [calldata]
    }
}

describe("ERC20 Transfer", function () {
    it("Should transfer ERC20 token", async function () {
        this.timeout(100000);

        ethers.provider = await startChain();
        const signer = ethers.provider.getSigner(0);

        let daiContract = new ethers.Contract(legos.erc20.dai.address, legos.erc20.abi, signer);

        let txs = [
            ["10", legos.erc20.dai.address, "0x12C4914c27B8A9A038E16104d06e8679c4eD8Dc6"],
            ["20", legos.erc20.dai.address, "0xaAF6da1c0e9CF6Fc7F18C5d648337e32EFbdE718"],
            ["30", legos.erc20.dai.address, "0xC69E1e6E3A8296Bb1b21158bA0C6c3447F5339e5"]
        ]

        let txObj = {
            adds: [],
            values: [],
            datas: []
        }
        // swapping 1 eth for dai to enable testing (uniswap)
        txObj = mergeTxObjs(txObj, await swapEthForDai("1"))

        // encoding and collecting current dai balances
        for (i = 0; i < txs.length; i++) {
            txObj = txObj = mergeTxObjs(txObj, await encoder(txs[i][0], txs[i][1], txs[i][2]))
        }

        const AtomicFactory = await ethers.getContractFactory("Atomic");
        atomicFactory = await AtomicFactory.deploy();
        await atomicFactory.launchAtomic(
            txObj.adds,
            txObj.values,
            txObj.datas, {
                value: ethers.utils.parseUnits("2", "ether").toHexString(),
                gasPrice: 1,
                gasLimit: 6500000,
            }
        );

        // encoding and collecting current dai balances
        for (i = 0; i < txs.length; i++) {
            // payload += await encoder (txs[i][0], txs[i][1], txs[i][2])
            let currentDaiBalance = await daiContract.balanceOf(txs[i][2])
            assert.equal(ethers.utils.parseEther(txs[i][0]).toString(), currentDaiBalance.toString())
        }
    });
});