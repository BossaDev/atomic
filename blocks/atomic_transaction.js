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
          src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/atom-symbol_269b.png",
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
  template: function () {
    return "" +
      '<block type="atomic_transaction" id="atomic_transaction">' +
      '</block>'
  }
};
