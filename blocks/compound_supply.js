const compound_supply = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 supply %3 %4",
      args0: [
        {
          type: "field_image",
          src: "https://compound.finance/images/compound-mark.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "UNIT",
        },
      ],
      colour: "#070a0e",
      category: Blockly.Categories.more,
      extensions: ["colours_control", "shape_statement", "scratch_extension"],
    });
  },
  //   encoder: function (value, unit, to) {
  //     // encoding for atomic
  //     let encoder = new ethers.utils.AbiCoder();
  //     let types = ["address", "uint256", "bytes"]; // to, value, data

  //     return encoder
  //       .encode(types, [
  //         to,
  //         ethers.utils.parseUnits(value, unit).toString(),
  //         "0x0",
  //       ])
  //       .slice(2);
  //   },
  template: function () {
    let ret =
      "" +
      '<block type="compoud_supply" id="compound_supply">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="UNIT">' +
      '<shadow type="compound-unit-list"></shadow>' +
      "</value>" +
      "</block>";
    return ret;
  },
};

Blockly.Blocks["compound_supply"] = compound_supply;

Blockly.Blocks["compound-unit-list"] = {
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
            ["ETH", "ETHER"],
            ["DAI", "DAI"],
          ],
        },
      ],
      extensions: ["colours_control", "output_string"],
    });
  },
};
