Blockly.Blocks["balance_swap"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 swap %3 %4 for %5",
      args0: [
        {
          type: "field_image",
          src:
            "https://gblobscdn.gitbook.com/spaces%2F-LtMQYB90ZuO38aKDyto%2Favatar.png",
          width: 50,
          height: 50,
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
          name: "TOKEN",
        },
        {
          type: "input_value",
          name: "TOKEN2",
        },
      ],
      category: Blockly.Categories.pen,
      tooltip: "Balancer Swap: Use to swap eth/tokens on Balancer.",
      colour: "#bebebe",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  encoder: async function (value, tokenFrom, tokenTo) {},
  template: function () {
    return (
      "" +
      '<block type="balance_swap" id="balance_swap">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="TOKEN">' +
      '<shadow type="balance_swap-list"></shadow>' +
      "</value>" +
      '<value name="TOKEN2">' +
      '<shadow type="balance_swap-list"></shadow>' +
      "</value>" +
      "</block>"
    );
  },
};

Blockly.Blocks["balance_swap-list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TOKEN",
          options: [
            ["ETH", "0x0"],
            ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
            ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
            ["WETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          ],
        },
      ],
      colour: "#bebebe",
      extensions: ["output_string"],
    });
  },
};
