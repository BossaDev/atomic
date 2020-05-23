Blockly.Blocks["uniswap_v2_swap"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 swap %3 %4 for %5",
      args0: [{
          type: "field_image",
          src: "https://uniswap.exchange/static/media/logo_white.edb44e56.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "TOKEN",
        },
        {
          type: "input_value",
          name: "TOKEN2",
        },
      ],
      category: Blockly.Categories.pen,
      colour: "#ff007b",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  encoder: async function (value, tokenFrom, tokenTo) {
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
          ethers.utils.parseEther(value).toString(), // amount in
          "1", // minimum amount, todo: slippage protection
          [tokenFrom, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], // path, weth is required last
          atomicProxyAddress, // recipient of output tokens
          Math.floor(Date.now() / 1000) + 9000 // deadline
        ])
      } else { // token to token
        swapCalldata = uniswapRouterInterface.functions.swapExactTokensForTokens.encode([
          ethers.utils.parseEther(value).toString(), // amount in
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
  },
  template: function () {
    return "" +
      '<block type="uniswap_v2_swap" id="uniswap_v2_swap">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      '</shadow>' +
      '</value>' +
      '<value name="TOKEN">' +
      '<shadow type="uniswap_token_list"></shadow>' +
      '</value>' +
      '<value name="TOKEN2">' +
      '<shadow type="uniswap_token_list"></shadow>' +
      '</value>' +
      '</block>'
  }
};

Blockly.Blocks["uniswap_token_list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [{
        type: "field_dropdown",
        name: "TOKEN",
        options: [
          ["ETH", "0x0"],
          ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
          ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
          ["WETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
        ],
      }, ],
      colour: "#ff007b",
      extensions: ["output_string"],
    });
  },
};