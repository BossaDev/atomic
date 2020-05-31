const braggerAbi = [{
  "inputs": [],
  "name": "brag",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]
const braggerAddress = "0xe58bb525b1f0e2c67332a5a0504361d00dddc4ed"


const bragger = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 Brag",
      args0: [{
          type: "field_image",
          src: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/money-mouth-face_1f911.png",
          width: 33,
          height: 33,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      colour: "#7300e6",
      tooltip: "Brag: Show off your balance like there is no tomorrow.",
      extensions: ["shape_statement"],
    });
  },
  category: "Atomic",
  encoder: function () {
    let braggerInterface = new ethers.utils.Interface(braggerAbi);
    let calldata = braggerInterface.functions.brag.encode([]);

    return {
      adds: [braggerAddress],
      values: ["0"],
      datas: [calldata],
    };
  },
  template: function () {
    return (
      "" +
      '<block type="bragger" id="bragger">' +
      "</block>"
    );
  },
};

Blockly.Blocks["bragger"] = bragger;