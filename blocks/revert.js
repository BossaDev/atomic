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
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/skull-and-crossbones_2620.png",
          width: 30,
          height: 30,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      //   category: Blockly.Categories.control,
      tooltip: "Use this block to forcibly revert a transaction",
      extensions: ["shape_end"],
    });
  },
  encoder: function () {
    return {
      adds: ["0x0"],
      values: [
        ethers.utils
          .bigNumberify("2")
          .pow(ethers.utils.bigNumberify("256"))
          .toString(),
      ],
      datas: ["0x0"],
    };
  },
  template: function () {
    return "" + '<block type="revert" id="revert">' + "</block>";
  },
};
