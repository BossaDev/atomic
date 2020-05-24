const compound_repay = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 repay %3 %4",
      args0: [{
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
          name: "VAL",
        },
        {
          type: "input_value",
          name: "UNIT",
        },
      ],
      colour: "#070a0e",
      category: Blockly.Categories.more,
      tooltip: "Compound Repay: Repay borrowed value from Compound.",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  encoder: function (value, token) {
    //   const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
    const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
    const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

    let substack = {
      adds: [],
      values: [],
      datas: [],
    };

    //1. Approve the token
    let tkAddress;
    let tkData;
    let tkValue;
    if (token == "DAI") {
      tkAddress = DAI;
      let tkAbi = [{
        constant: false,
        inputs: [{
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [{
          internalType: "bool",
          name: "",
          type: "bool",
        }, ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
        signature: "0x095ea7b3",
      }, ];
      let inter = new ethers.utils.Interface(tkAbi);
      tkData = inter.functions.approve.encode([
        cDAI,
        ethers.utils.parseEther(value),
      ]);
      tkValue = "0";
    }
    substack.adds.push(tkAddress);
    substack.values.push(tkValue);
    substack.datas.push(tkData);

    //2. Repay Borrow
    const repayABI = [{
      constant: false,
      inputs: [{
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      }, ],
      name: "repayBorrow",
      outputs: [{
        internalType: "uint256",
        name: "",
        type: "uint256",
      }, ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x0e752702",
    }, ];

    //2 Enter Market with funds
    let repayInt = new ethers.utils.Interface(repayABI);
    let repayData = repayInt.functions.repayBorrow.encode([
      ethers.utils.parseEther(value),
    ]);
    substack.adds.push(cDAI);
    substack.values.push("0");
    substack.datas.push(repayData);

    return substack;
  },
  template: function () {
    let ret =
      "" +
      '<block type="compound_repay" id="compound_repay">' +
      '<value name="VAL">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="UNIT">' +
      '<shadow type="compound-unit-borrow-list"></shadow>' +
      "</value>" +
      "</block>";
    return ret;
  },
};

Blockly.Blocks["compound_repay"] = compound_repay;

// Blockly.Blocks["compound-unit-list"] = {
//   /**
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: "%1",
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "UNIT",
//           options: [
//             ["ETH", "ETHER"],
//             ["DAI", "DAI"],
//           ],
//         },
//       ],
//       colour: "#070a0e",
//       extensions: ["colours_pen", "output_string"],
//     });
//   },
// };