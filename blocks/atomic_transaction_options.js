Blockly.Blocks["atomic_transaction_options"] = {
  /**
   * Block for when loudness/timer/video motion is greater than the value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 Transaction %3ETH",
      args0: [
        {
          type: "field_image",
          src: "./media/atomic-ninja-icon.png",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        // {
        //   type: "field_dropdown",
        //   name: "GAS",
        //   options: [
        //     ["High", "H"],
        //     ["Med", "M"],
        //     ["Low", "L"],
        //   ],
        // },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      colour: "#7300e6",
      // category: Blockly.Categories.event,
      tooltip:
        "Atomic transaction start block (w/ options): Use this block to start a transaction (or any of similar shape). This one is used if you want to send Eth along with your atomic transaction.",
      extensions: ["shape_hat"],
    });
  },
  category: "Atomic",
  template: function () {
    return (
      "" +
      '<block type="atomic_transaction_options" id="atomic_transaction_options">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      "</block>"
    );
  },
};
