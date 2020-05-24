const defi_zaps = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 invest %3 ETH in %4",
      args0: [
        {
          type: "field_image",
          src: "https://defizap.com/static/media/save-gas.81e35b11.svg",
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
          name: "TO",
        },
      ],
      colour: "#660000",
      category: Blockly.Categories.more,
      tooltip: "Defi Zaps: Choose one Zap on the dropdown and the value to supply liquidity to Uniswap pools and more.",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  encoder: function (value, to) {
    // encoding for atomic
    let encoder = new ethers.utils.AbiCoder();
    let types = ["address", "uint256", "bytes"]; // to, value, data

    return {
      adds: [to],
      values: [ethers.utils.parseUnits(value, "ether").toString()],
      datas: ["0x0"],
    };
  },
  template: function () {
    return (
      "" +
      '<block type="defi_zaps" id="defi_zaps">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="TO">' +
      '<shadow type="ens_resolver">' +
      '<value name="STRING">' +
      '<shadow type="zap-list">' +
      //   '<field name="TEXT"><shadow type="zap-list"></shadow></field>' +
      "</shadow>" +
      "</value>" +
      "</shadow>" +
      "</value>" +
      "</block>"
    );
  },
};

Blockly.Blocks["defi_zaps"] = defi_zaps;

Blockly.Blocks["zap-list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TEXT",
          options: [
            ["sETHUnipool.DeFiZap.eth", "sETHUnipool.DeFiZap.eth"],
            ["MKRUnipool.DeFiZap.eth", "MKRUnipool.DeFiZap.eth"],
            // ["ETH", "ETHER"],
          ],
        },
      ],
      colour: "#660000",
      extensions: ["output_string"],
    });
  },
};
