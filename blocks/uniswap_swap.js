Blockly.Blocks["uniswap_swap"] = {
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
  encoder: function () {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, ["0x0", 0, "0x0"]);
  },
  template: function () {
    return "" +
      '<block type="uniswap_swap" id="extension_uniswap_swap">' +
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
