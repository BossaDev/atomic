Blockly.Blocks["ens_resolver"] = {
  /**
   * Block for string length operator.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [{
          type: "field_image",
          src: "./media/ens.png",
          width: 30,
          height: 30,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "STRING",
        },
      ],
      category: Blockly.Categories.operators,
      extensions: ["colours_sensing", "output_string"],
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
      '<block type="ens_resolver" id="ens_resolver">' +
      '<value name="STRING">' +
      '<shadow type="text">' +
      '<field name="TEXT">vitalik.eth</field>' +
      '</shadow>' +
      '</value>' +
      '</block>'
  }
};
