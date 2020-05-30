Blockly.Blocks["selfdestruct"] = {
  /**
   * Block for "delete this clone."
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 selfdestruct",
      args0: [
        {
          type: "field_image",
          src:
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/skull-and-crossbones_2620.png",
          width: 30,
          height: 30,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.control,
      extensions: ["colours_event", "shape_end"],
    });
  },
  category: "Atomic",
  encoder: function () {
    // encoding for atomic
    // let encoder = new ethers.utils.AbiCoder();
    // let types = ["address", "uint256", "bytes"]; // to, value, data

    // return encoder.encode(types, ["0x0", 0, "0x0"]);

    return "";
  },
  template: function () {
    return "" + '<block type="selfdestruct" id="selfdestruct">' + "</block>";
  },
};
