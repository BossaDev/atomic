Blockly.Blocks["selfdestruct"] = {
  /**
   * Block for "delete this clone."
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 selfdestruct",
      args0: [{
          type: "field_image",
          src: "https://lh5.googleusercontent.com/proxy/yafLjy7SuQiyUFAqjRDsCjTURzT1Sh134FlcuTJYoLgSr6kt1fNRRnkTPOpKQKKsHTUH2rpCfENm7WvXwJNPUvLhS5lECvqjy6GBPcEJJjT1HAIWkYwXdya50k3DUBDvkFy-",
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
  encoder: function () {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, ["0x0", 0, "0x0"]);
  },
  template: function () {
    return "" +
      '<block type="selfdestruct" id="selfdestruct">' +
      '</block>'
  }
};
