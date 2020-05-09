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
      extensions: ["colours_more", "shape_statement", "scratch_extension"],
    });
  },
  encoder: async function (value, tokenFrom, tokenTo) {
    if (tokenFrom == tokenTo) {
      console.log("Error (uniswap_v1_swap): Cannot swap for the same token, please use different tokens from/to.")
      return
    }

    // uniswap factory (to find out exchanges for tokens)
    let uniswapTestFactory = new ethers.Contract(legos.uniswap.factory.address, legos.uniswap.factory.abi, signer);

    // gets 
    let getExchange = async (tokenAddress) => {
      let exchangeAddress = await uniswapTestFactory.getExchange(tokenAddress)
      return exchangeAddress
    }

    let uniswapExchangeInterface = new ethers.utils.Interface(legos.uniswap.exchange.abi);
    let erc20Interface = new ethers.utils.Interface(legos.erc20.abi)

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    let exchange = (tokenFrom == "0x0") ? await getExchange(tokenTo) : await getExchange(tokenFrom)

    if (tokenFrom == "0x0") { // from ether to token

      let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode(["2", Math.floor(Date.now() / 1000) + 300])
      return encoder.encode(types, [exchange, ethers.utils.parseEther(value), calldata]).slice(2)

    } else {

      let aproveCalldata = erc20Interface.functions.approve.encode([exchange, ethers.utils.parseEther(value)])
      let swapCalldata

      if (tokenTo == "0x0") { // from token to ether
        swapCalldata = uniswapExchangeInterface.functions.tokenToEthSwapInput.encode([ethers.utils.parseEther(value), "1", Math.floor(Date.now() / 1000) + 300])
      } else { // token to token
        swapCalldata = uniswapExchangeInterface.functions.tokenToTokenSwapInput.encode([ethers.utils.parseEther(value), "1", "1", Math.floor(Date.now() / 1000) + 300, tokenTo])
      }

      return encoder.encode(types, [tokenFrom, "0", aproveCalldata]).slice(2) + encoder.encode(types, [exchange, "0", swapCalldata]).slice(2)

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
      extensions: ["colours_more", "output_string"],
    });
  },
};