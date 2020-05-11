Blockly.Blocks["erc20_transfer"] = {
  /**
   * @this Blockly.Block
   */

  init: function () {
    this.jsonInit({
      message0: "%1 %2 transfer %3 %4 to %5",
      args0: [{
          type: "field_image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
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
          name: "TO",
        },
      ],
      category: Blockly.Categories.more,
      colour: 359,
      extensions: ["shape_statement"]
    });
  },

  encoder: function (value, tokenAddress, to) {
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
    }
  ]
    let erc20Interface = new ethers.utils.Interface(erc20TransferAbi)
    let calldata = erc20Interface.functions.transfer.encode([to, ethers.utils.parseEther(value)])

    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, [tokenAddress, "0", calldata]).slice(2);
  },
  template: function () {
    return "" +
      '<block type="erc20_transfer" id="erc20_transfer">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      '</shadow>' +
      '</value>' +
      '<value name="TOKEN">' +
      '<shadow type="erc20_token_list"></shadow>' +
      '</value>' +
      '<value name="TO">' +
      '<shadow type="ens_resolver">' +
      '<value name="STRING">' +
      '<shadow type="text">' +
      '<field name="TEXT">atomicninja.eth</field>' +
      '</shadow>' +
      '</value>' +
      '</shadow>' +
      '</value>' +
      '</block>'
  }
};

Blockly.Blocks["erc20_token_list"] = {
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
          ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
          ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
          ["WETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
        ],
      }, ],
      extensions: ["colours_pen", "output_string"],
    });
  },
};