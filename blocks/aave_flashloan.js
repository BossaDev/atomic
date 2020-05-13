Blockly.Blocks["aave_flashloan"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "aave_flashloan",
      // "message0": Blockly.Msg.CONTROL_REPEAT,
      message0: "%1 %2 flashloan %3 %4",
      message1: "%1", // Recheio
      // "message2": "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [{
          type: "field_image",
          src: "./media/aaveghost.svg",
          width: 40,
          height: 30,
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
      ],
      args1: [{
        type: "input_statement",
        name: "SUBSTACK",
      }, ],
      // "args2": [{
      //   "type": "field_image",
      //   "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
      //   "width": 24,
      //   "height": 24,
      //   "alt": "*",
      //   "flip_rtl": true
      // }],
      // "nextStatement": null,
      category: Blockly.Categories.control,
      extensions: ["colours_looks", "shape_statement"],
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
      '<block type="aave_flashloan" id="aave_flashloan">' +
      '<value name="VALUE">' +
      '<shadow type="math_whole_number">' +
      '<field name="NUM">10</field>' +
      '</shadow>' +
      '</value>' +
      '<value name="TOKEN">' +
      '<shadow type="aave_token_list"></shadow>' +
      '</value>' +
      '</block>'
  }
};
Blockly.Blocks["aave_token_list"] = {
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
          ["WETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
          ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
        ],
      }, ],
      extensions: ["colours_looks", "output_string"],
    });
  },
};
