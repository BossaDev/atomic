Blockly.Blocks["atomic_transaction"] = {
  /**
   * Block for when loudness/timer/video motion is greater than the value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 transaction",
      args0: [{
          type: "field_image",
          src: "https://d29fhpw069ctt2.cloudfront.net/icon/image/81267/preview5.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.event,
      extensions: ["colours_event", "shape_hat"],
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
      '<block type="atomic_transaction" id="atomic_transaction">' +
      '</block>'
  }
};
