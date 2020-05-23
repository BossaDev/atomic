Blockly.Blocks["aave_flashloan"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "aave_flashloan",
      // "message0": Blockly.Msg.CONTROL_REPEAT,
      message0: "%1 %2 flashloan %3 %4",
      message1: "%1", // Recheio
      // "message2": "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "field_image",
          src: "./media/aaveghost.svg",
          width: 40,
          height: 30,
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
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      // "args2": [{
      //   "type": "field_image",
      //   "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
      //   "width": 24,
      //   "height": 24,
      //   "alt": "*",
      //   "flip_rtl": true
      // }],
      // "nextStatement": null,
      category: Blockly.Categories.control,
      colour: "#B6509E",
      extensions: ["shape_statement"],
    });
  },
  encoder: function (token, value, substack) {
    const aave_core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
    const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    const loanerAdd = "0xdeployedContract";
    const loanerABI = [
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "assetToFlashLoan",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToLoan",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_params",
            type: "bytes",
          },
        ],
        name: "initateFlashLoan",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    if (loanerAdd == undefined) {
      loanerAdd = "0xdeployedContract";
    }

    //Encode call to return funds
    let erc20Interface = new ethers.utils.Interface(legos.erc20.abi);
    let fee = value.mul(ethers.utils.bigNumberify("9")).div("10000");

    if (token == eth_token) {
      substack.adds.push(aave_core);
      substack.weiValues.push(value.add(fee));
      substack.datas.push("0x0");
    } else {
      substack.adds.push(token);
      substack.weiValues.push("0");
      let token_transfer = erc20Interface.functions.transfer.encode([
        aave_core,
        value.add(fee),
      ]);
      substack.datas.push(token_transfer);
    }

    let poolReturn = encodeForAtomic(
      substack.adds,
      substack.weiValues,
      substack.datas
    );

    let loanerInterface = new ethers.utils.Interface(loanerABI);
    // Encode call to Loaner Contract
    let loanerData = loanerInterface.functions.initateFlashLoan.encode([
      token,
      value,
      "0x" + poolReturn,
    ]);

    return { adds: [loanerAdd], values: ["0"], datas: [loanerData] };
  },
  template: function () {
    return (
      "" +
      '<block type="aave_flashloan" id="aave_flashloan">' +
      '<value name="VALUE">' +
      '<shadow type="math_whole_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="TOKEN">' +
      '<shadow type="aave_token_list"></shadow>' +
      "</value>" +
      "</block>"
    );
  },
};
Blockly.Blocks["aave_token_list"] = {
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
            ["ETH", "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"],
            // ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
            // ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
          ],
        },
      ],
      colour: "#B6509E",
      extensions: ["output_string"],
    });
  },
};
