Blockly.Blocks["uniswap_v2_flashswap"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "uniswap_v2_flashswap",
      // "message0": Blockly.Msg.CONTROL_REPEAT,
      message0: "%1 %2 flashswap %3 %4",
      message1: "%1", // Recheio
      // "message2": "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [{
          type: "field_image",
          src: "https://uniswap.exchange/static/media/logo_white.edb44e56.svg",
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
      colour: "#ff007b",
      extensions: ["shape_statement"],
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
      '<block type="uniswap_v2_flashswap" id="uniswap_v2_flashswap">' +
      '<value name="VALUE">' +
      '<shadow type="math_whole_number">' +
      '<field name="NUM">10</field>' +
      '</shadow>' +
      '</value>' +
      '<value name="TOKEN">' +
      '<shadow type="uniswap_token_list"></shadow>' +
      '</value>' +
      '</block>'
  }
};

