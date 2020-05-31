const atomic_tip = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 Tip %3",
      args0: [
        {
          type: "field_image",
          src:
          "./media/atomic-ninja-icon.png",
          width: 35,
          height: 35,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "UNIT", // wei, beer or lunch
        },
      ],
      colour: "#7300e6",
      category: Blockly.Categories.more,
      tooltip: "Send ETH: Transfer ether to the provided address.",
      extensions: ["shape_statement"],
    });
  },
  category: "Atomic",
  encoder: function (value) {
    return {
      adds: ["0x7e6045240203591B985F04FdB3C9B78537A17cb3"],
      values: [value],
      datas: ["0x0"],
    };
  },
  template: function () {
    return (
      "" +
      '<block type="atomic_tip" id="atomic_tip">' +
      '<value name="UNIT">' +
      '<shadow type="atomic-tip-unit-list"></shadow>' +
      "</value>" +
      "</block>"
    );
  },
};

Blockly.Blocks["atomic_tip"] = atomic_tip;

Blockly.Blocks["atomic-tip-unit-list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "UNIT",
          options: [
            ["🍺", "20000000000000000"], // (.02 ETH)
            ["🥪", "80000000000000000"], // (.08 ETH)
            ["1 WEI", "1"],
          ],
        },
      ],
      colour: "#4d0099",
      extensions: ["output_string"],
    });
  },
};
