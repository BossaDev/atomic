const eth_transfer = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 send %3 %4 to %5",
      args0: [{
          type: "field_image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
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
        {
          type: "input_value",
          name: "TO",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_control", "shape_statement", "scratch_extension"],
    });
  },
  encoder: function (value, unit, to) {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return encoder.encode(types, [to, ethers.utils.parseUnits(value, unit).toString(), "0x0"]).slice(2);
  },
  template: function () {
    return "" +
      '<block type="eth_transfer" id="eth_transfer">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      '</shadow>' +
      '</value>' +
      '<value name="UNIT">' +
      '<shadow type="eth-unit-list"></shadow>' +
      '</value>' +
      '<value name="TO">' +
      '<shadow type="ens_resolver">' +
      '<value name="STRING">' +
      '<shadow type="text">' +
      '<field name="TEXT">vitalik.eth</field>' +
      '</shadow>' +
      '</value>' +
      '</shadow>' +
      '</value>' +
      '</block>'
  }
};


Blockly.Blocks["eth_transfer"] = eth_transfer

Blockly.Blocks["eth-unit-list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [{
        type: "field_dropdown",
        name: "UNIT",
        options: [
          ["WEI", "WEI"],
          ["GWEI", "GWEI"],
          ["ETH", "ETHER"],
        ],
      }, ],
      extensions: ["colours_control", "output_string"],
    });
  },
};