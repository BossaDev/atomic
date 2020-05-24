const {
    assert
} = require("chai");
const {
    legos
} = require("@studydefi/money-legos");

const {
    startChain,
    atomicAbi,
    getMainnetAtomic,
    swapEthForDai,
    mergeTxObjs
} = require("./testHelpers");

const loanerABI = [{
    "inputs": [{
            "internalType": "address",
            "name": "assetToFlashSwap",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "amountToLoan",
            "type": "uint256"
        },
        {
            "internalType": "bytes",
            "name": "_params",
            "type": "bytes"
        }
    ],
    "name": "initateFlashswap",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}];

const encoder = async (value, token, substack, loanerAdd) => {

    if (loanerAdd == undefined) {
        loanerAdd = "0xdeployedContract";
    }

    //Encode call to return funds
    let erc20Interface = new ethers.utils.Interface(legos.erc20.abi);

    uniswapFactoryAbi = [{
        constant: true,
        inputs: [{
                internalType: "address",
                name: "tokenA",
                type: "address"
            },
            {
                internalType: "address",
                name: "tokenB",
                type: "address"
            }
        ],
        name: "getPair",
        outputs: [{
            internalType: "address",
            name: "pair",
            type: "address"
        }],
        payable: false,
        stateMutability: "view",
        type: "function"
    }]

    const provider = ethers.getDefaultProvider();
    let uniswapFactory = new ethers.Contract("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", uniswapFactoryAbi, provider)
    let exchange = await uniswapFactory.getPair("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", token);

    let val = ethers.utils.bigNumberify(value)
    let fee = val.mul(ethers.utils.bigNumberify("50")).div("10000");

    // Transfer tokens back to exchange
    substack.adds.push("0x6b175474e89094c44da98b954eedeac495271d0f");
    substack.values.push("0");
    let token_transfer = erc20Interface.functions.transfer.encode([
        exchange,
        val.add(fee),
    ]);
    substack.datas.push(token_transfer);

    let inter = new ethers.utils.Interface(atomicAbi);
    let poolReturn = inter.functions.execute.encode([substack.adds, substack.values, substack.datas])

    let loanerInterface = new ethers.utils.Interface(loanerABI);
    // Encode call to Loaner Contract
    let loanerData = loanerInterface.functions.initateFlashswap.encode([
        token,
        value,
        poolReturn,
    ]);

    let daiSwap = swapEthForDai("10")

    let daiTransfer = erc20Interface.functions.transfer.encode([
        loanerAdd,
        ethers.utils.parseEther("500").toString(),
    ]);

    let transferDai = {
        adds: [legos.erc20.dai.address],
        values: ["0"],
        datas: daiTransfer
    }

    daiSwap = mergeTxObjs(daiSwap, transferDai)

    return mergeTxObjs(daiSwap, {
        adds: [loanerAdd],
        values: ["0"],
        datas: [loanerData]
    });
};

describe("Uniswap V2 Flash Swap", function () {

    let loanerContract = {};
    let substack = {
        adds: [],
        values: [],
        datas: [],
    };

    it("Should perform flashswaps correctly", async function () {
        this.timeout(1000000);


        ethers.provider = await startChain();

        const AtomicFactory = await ethers.getContractFactory("Atomic");
        atomicFactory = await AtomicFactory.deploy("0x608060405234801561001057600080fd5b50326000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610261806100a16000396000f3fe60806040526004361061002d5760003560e01c80638da5cb5b146100d6578063c45a01551461010157610034565b3661003457005b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000366040516100809291906101ab565b600060405180830381855af49150503d80600081146100bb576040519150601f19603f3d011682016040523d82523d6000602084013e6100c0565b606091505b50509050806100d3573d6000803e3d6000fd5b50005b3480156100e257600080fd5b506100eb61012c565b6040516100f891906101c4565b60405180910390f35b34801561010d57600080fd5b50610116610151565b60405161012391906101c4565b60405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610180816101ea565b82525050565b600061019283856101df565b935061019f83858461021c565b82840190509392505050565b60006101b8828486610186565b91508190509392505050565b60006020820190506101d96000830184610177565b92915050565b600081905092915050565b60006101f5826101fc565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b8281833760008383015250505056fea2646970667358221220c253016a11ae1443c02efb8b31dda0cfddbb78ad730435d35658bfcc9e0b81c664736f6c63430006080033");

        const LoanerFactory = await ethers.getContractFactory("Flashswap");
        loanerContract = await LoanerFactory.deploy();

        let amount = ethers.utils.parseEther("50");
        // console.log("Atomic Factory", atomicFactory.address);

        //encode call to factory
        let txs = await encoder(amount, legos.erc20.dai.address, substack, loanerContract.address);

        const signer = ethers.provider.getSigner(0);

        let atomic = getMainnetAtomic(signer)

        await atomic.launchAtomic(txs.adds, txs.values, txs.datas, {
            value: ethers.utils.parseUnits("50", "ether").toHexString()
        })
    });
});