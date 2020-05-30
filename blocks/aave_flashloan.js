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
      args0: [{
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
      args1: [{
        type: "input_statement",
        name: "SUBSTACK",
      }, ],
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
      tooltip: "Aave flashloan block: Include blocks inside this one, they are the actions while you have the loan in hands. Make sure you have enough to repay (including the 0.09% fee) by the end of the internal transaction (repayment is automatic).",
      extensions: ["shape_statement"],
    });
  },
  category: "Aave",
  encoder: function (value, token, substack) {
    if (!substack) substack = {
      adds: [],
      values: [],
      datas: []
    }

    let val = ethers.utils.bigNumberify(ethers.utils.parseEther(value))
    const aave_core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
    const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    const loanerAdd = "0xa08E96Da1a5622B0dE11E07cf075966d48AF06d5";
    const loanerABI = [{
      constant: false,
      inputs: [{
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
    }, ];

    // if (loanerAdd == undefined) {
    //   loanerAdd = "0xdeployedContract";
    // }

    let erc20TransferAbi = [{
      "constant": false,
      "inputs": [{
          "internalType": "address",
          "name": "dst",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }]

    //Encode call to return funds
    let erc20Interface = new ethers.utils.Interface(erc20TransferAbi);
    let fee = val.mul(ethers.utils.bigNumberify("9")).div("10000")

    if (token == eth_token) {
      substack.adds.push(aave_core);
      substack.values.push(val.add(fee));
      substack.datas.push("0x0");
    } else {
      substack.adds.push(token);
      substack.values.push("0");
      let token_transfer = erc20Interface.functions.transfer.encode([
        aave_core,
        val.add(fee)
      ]);
      substack.datas.push(token_transfer);
    }

    let inter = new ethers.utils.Interface(atomicAbi);
    let poolReturn = inter.functions.execute.encode([substack.adds, substack.values, substack.datas])

    let loanerInterface = new ethers.utils.Interface(loanerABI);
    // Encode call to Loaner Contract
    let loanerData = loanerInterface.functions.initateFlashLoan.encode([
      token,
      ethers.utils.parseEther(value),
      poolReturn,
    ]);

    return {
      adds: [loanerAdd],
      values: ["0"],
      datas: [loanerData]
    };
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
      args0: [{
        type: "field_dropdown",
        name: "TOKEN",
        options: [
          ["ETH", "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"],
          // ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
          // ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
        ],
      }, ],
      colour: "#B6509E",
      extensions: ["output_string"],
    });
  },
};