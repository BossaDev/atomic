Blockly.Blocks["uniswap_v1_swap"] = {
    /**
     * @this Blockly.Block
     */
    init: function () {
      this.jsonInit({
        message0: "%1 %2 swap %3 %4 for %5",
        args0: [{
            type: "field_image",
            src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/unicorn-face_1f984.png",
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
        tooltip: "Uniswap V1 Swap: Swap eth/tokens in Uniswap V1.",
        extensions: ["colours_more", "shape_statement", "scratch_extension"],
      });
    },
    encoder: async function (value, tokenFrom, tokenTo) {
      if (tokenFrom == tokenTo)
        throw TypeError("Error (uniswap_v1_swap): Cannot swap for the same token, please use different tokens from/to.")
      
  
      let uniswapFactoryAbi = [{
        "name": "getExchange",
        "outputs": [{
          "type": "address",
          "name": "out"
        }],
        "inputs": [{
          "type": "address",
          "name": "token"
        }],
        "constant": true,
        "payable": false,
        "type": "function",
        "gas": 715
      }]
  
      // uniswap factory (to find out exchanges for tokens)
      let uniswapFactory = new ethers.Contract("0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95", uniswapFactoryAbi, new ethers.getDefaultProvider());
  
      // gets 
      let getExchange = async (tokenAddress) => {
        let exchangeAddress = await uniswapFactory.getExchange(tokenAddress)
        return exchangeAddress
      }
  
      let uniswapExchangeAbi = [{
        "name": "ethToTokenSwapInput",
        "outputs": [{
          "type": "uint256",
          "name": "out"
        }],
        "inputs": [{
            "type": "uint256",
            "name": "min_tokens"
          },
          {
            "type": "uint256",
            "name": "deadline"
          }
        ],
        "constant": false,
        "payable": true,
        "type": "function",
        "gas": 12757
      }, {
        "name": "tokenToEthSwapInput",
        "outputs": [{
          "type": "uint256",
          "name": "out"
        }],
        "inputs": [{
            "type": "uint256",
            "name": "tokens_sold"
          },
          {
            "type": "uint256",
            "name": "min_eth"
          },
          {
            "type": "uint256",
            "name": "deadline"
          }
        ],
        "constant": false,
        "payable": false,
        "type": "function",
        "gas": 47503
      }, {
        "name": "tokenToTokenSwapInput",
        "outputs": [{
          "type": "uint256",
          "name": "out"
        }],
        "inputs": [{
            "type": "uint256",
            "name": "tokens_sold"
          },
          {
            "type": "uint256",
            "name": "min_tokens_bought"
          },
          {
            "type": "uint256",
            "name": "min_eth_bought"
          },
          {
            "type": "uint256",
            "name": "deadline"
          },
          {
            "type": "address",
            "name": "token_addr"
          }
        ],
        "constant": false,
        "payable": false,
        "type": "function",
        "gas": 51007
      }]
  
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
  
      let uniswapExchangeInterface = new ethers.utils.Interface(uniswapExchangeAbi);
      let erc20Interface = new ethers.utils.Interface(ERC20approveAbi)
  
      let exchange = (tokenFrom == "0x0") ? await getExchange(tokenTo) : await getExchange(tokenFrom)
  
      let deadline = Math.floor(Date.now() / 1000) + 300 // 5mins
  
      if (tokenFrom == "0x0") { // from ether to token
  
        let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode(["2", deadline])
        return {
            adds: [exchange],
            values: [ethers.utils.parseEther(value).toString()],
            datas: [calldata]
        }
  
      } else {
  
        let aproveCalldata = erc20Interface.functions.approve.encode([exchange, ethers.utils.parseEther(value)])
        let swapCalldata
  
        if (tokenTo == "0x0") { // from token to ether
          swapCalldata = uniswapExchangeInterface.functions.tokenToEthSwapInput.encode([ethers.utils.parseEther(value), "1", deadline])
        } else { // token to token
          swapCalldata = uniswapExchangeInterface.functions.tokenToTokenSwapInput.encode([ethers.utils.parseEther(value), "1", "1", deadline, tokenTo])
        }
  
        return {
            adds: [tokenFrom, exchange],
            values: ["0", "0"],
            datas: [aproveCalldata, swapCalldata]
        }
      }
    },
    template: function () {
      return "" +
        '<block type="uniswap_v1_swap" id="uniswap_v1_swap">' +
        '<value name="VALUE">' +
        '<shadow type="math_number">' +
        '<field name="NUM">10</field>' +
        '</shadow>' +
        '</value>' +
        '<value name="TOKEN">' +
        '<shadow type="uniswap_V1_token_list"></shadow>' +
        '</value>' +
        '<value name="TOKEN2">' +
        '<shadow type="uniswap_V1_token_list"></shadow>' +
        '</value>' +
        '</block>'
    }
  };
  
  Blockly.Blocks["uniswap_V1_token_list"] = {
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
        extensions: ["colours_more", "output_string"],
      });
    },
  };