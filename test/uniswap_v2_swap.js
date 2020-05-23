const {
    assert
} = require("chai");

const ethers = require("ethers");
const {
    legos
} = require("@studydefi/money-legos")

const {
    startChain,
    getMainnetAtomic,
    getUserAddress,
    mergeTxObjs
} = require("./testHelpers")

// encoder from the block
let encoder = async function (value, tokenFrom, tokenTo) {
    if (tokenFrom == tokenTo) {
        throw TypeError("Error (uniswap_v2_swap): Cannot swap for the same token, please use different tokens from/to.")
        return
    }

    const uniswapRouterAddress = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"
    const uniswapRouterAbi = [{
            inputs: [],
            name: "WETH",
            outputs: [{
                internalType: "address",
                name: "",
                type: "address"
            }],
            stateMutability: "pure",
            type: "function"
        },
        {
            inputs: [{
                    internalType: "uint256",
                    name: "amountOutMin",
                    type: "uint256"
                },
                {
                    internalType: "address[]",
                    name: "path",
                    type: "address[]"
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address"
                },
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256"
                }
            ],
            name: "swapExactETHForTokens",
            outputs: [{
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }],
            stateMutability: "payable",
            type: "function"
        },
        {
            inputs: [{
                    internalType: "uint256",
                    name: "amountIn",
                    type: "uint256"
                },
                {
                    internalType: "uint256",
                    name: "amountOutMin",
                    type: "uint256"
                },
                {
                    internalType: "address[]",
                    name: "path",
                    type: "address[]"
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address"
                },
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256"
                }
            ],
            name: "swapExactTokensForETH",
            outputs: [{
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }],
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            inputs: [{
                    internalType: "uint256",
                    name: "amountIn",
                    type: "uint256"
                },
                {
                    internalType: "uint256",
                    name: "amountOutMin",
                    type: "uint256"
                },
                {
                    internalType: "address[]",
                    name: "path",
                    type: "address[]"
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address"
                },
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256"
                }
            ],
            name: "swapExactTokensForTokens",
            outputs: [{
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }],
            stateMutability: "nonpayable",
            type: "function"
        }
    ]

    let ERC20approveAbi = [{
        "constant": false,
        "inputs": [{
                "internalType": "address",
                "name": "usr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    let erc20Interface = new ethers.utils.Interface(ERC20approveAbi)
    let uniswapRouterInterface = new ethers.utils.Interface(uniswapRouterAbi)

    let provider = new ethers.getDefaultProvider("homestead")
    let atomic = getMainnetAtomic(provider)
    let userAddress = getUserAddress();

    let atomicProxyAddress = await atomic.getNextAtomic(userAddress)

    if (tokenFrom == "0x0") { // from ether to token

        let calldata = uniswapRouterInterface.functions.swapExactETHForTokens.encode([
            "0", // minimum amount, todo: slippage protection
            ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", tokenTo], // path, weth is required first
            atomicProxyAddress, // recipient of output tokens
            Math.floor(Date.now() / 1000) + 9000 // deadline
        ])
        return {
            adds: [uniswapRouterAddress],
            values: [ethers.utils.parseEther(value).toString()],
            datas: [calldata]
        }

    } else {

        let aproveCalldata = erc20Interface.functions.approve.encode([uniswapRouterAddress, ethers.utils.parseEther(value)])
        let swapCalldata

        if (tokenTo == "0x0") { // from token to ether
            swapCalldata = uniswapRouterInterface.functions.swapExactTokensForETH.encode([
                ethers.utils.parseEther(value).toString(),// amount in
                "1", // minimum amount, todo: slippage protection
                [tokenFrom, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], // path, weth is required last
                atomicProxyAddress, // recipient of output tokens
                Math.floor(Date.now() / 1000) + 9000 // deadline
            ])
        } else { // token to token
            swapCalldata = uniswapRouterInterface.functions.swapExactTokensForTokens.encode([
                ethers.utils.parseEther(value).toString(),// amount in
                "1", // minimum amount, todo: slippage protection
                [tokenFrom, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", tokenTo], // path
                atomicProxyAddress, // recipient of output tokens
                Math.floor(Date.now() / 1000) + 9000 // deadline
            ])
        }

        return {
            adds: [tokenFrom, uniswapRouterAddress],
            values: ["0", "0"],
            datas: [aproveCalldata, swapCalldata]
        }

    }
}

describe("Uniswap V2 Swap", function () {

    it("Should swap", async function () {
        this.timeout(20000000);

        provider = await startChain();
        const signer = provider.getSigner(0);
        accounts = await provider.listAccounts()

        let daiContract = new ethers.Contract(legos.erc20.dai.address, legos.erc20.abi, provider);
        let wbtcContract = new ethers.Contract(legos.erc20.wbtc.address, legos.erc20.abi, provider);

        let previousEthBalance = await provider.getBalance(accounts[0])

        // all three types of transactions will be fired at once, to speed up testing and keep things atomic style
        let payload = await encoder("1", "0x0", legos.erc20.dai.address)
        // payload = mergeTxObjs(payload, await encoder("5", legos.erc20.dai.address, "0x0"))
        // payload = mergeTxObjs(payload, await encoder("5", legos.erc20.dai.address, legos.erc20.wbtc.address))

        let atomic = getMainnetAtomic(signer)
        let atomicProxyAddress = await atomic.getNextAtomic(accounts[0])

        console.log(atomicProxyAddress)

        await atomic.execute(payload.adds, payload.values, payload.datas, {
            value: ethers.utils.parseUnits("2", "ether").toHexString()
        })

        let currentEthBalance = await provider.getBalance(accounts[0])
        let daiBalance = await daiContract.balanceOf(atomicProxyAddress)
        let wbtcBalance = await wbtcContract.balanceOf(atomicProxyAddress)

        assert(currentEthBalance.lt(previousEthBalance), 'ETH was not spent');
        assert(daiBalance.gt(0), 'DAI not swapped');
        assert(wbtcBalance.gt(0), 'WBTC not swapped');
    });
});