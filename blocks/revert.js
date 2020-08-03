// import { ethers } from "ethers";

Blockly.Blocks["revert"] = {
  /**
   * Block for "delete this clone."
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 Revert",
      args0: [
        {
          type: "field_image",
          src:
            "./media/revert.png",
          width: 30,
          height: 30,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      //   category: Blockly.Categories.control,
      colour: "#7300e6",
      tooltip: "Use this block to forcibly revert a transaction",
      extensions: ["shape_end"],
    });
  },
  category: "Atomic",
  encoder: function () {
    return {
      adds: ["0x0000000000000000000000000000000000000000"],
      values: [ethers.constants.MaxUint256],
      datas: ["0x0"],
    };
  },
  template: function () {
    return "" + '<block type="revert" id="revert">' + "</block>";
  },
};
