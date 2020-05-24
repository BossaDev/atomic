const compound_supply = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 supply %3 %4",
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
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  encoder: function (value, token) {
    const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
    const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";

    let substack = {
      adds: [],
      values: [],
      datas: [],
    };

    //1. Mint the desired collateral
    let tkAddress;
    let tkData;
    let tkValue;
    if (token == "ETH") {
      tkAddress = cETH;
      let tkAbi = [{
        constant: false,
        inputs: [],
        name: "mint",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function",
        signature: "0x1249c58b",
      }, ];

      let inter = new ethers.utils.Interface(tkAbi);
      tkData = inter.functions.mint.encode([]);
      tkValue = ethers.utils.parseEther(value);
    } else if (token == "DAI") {
      tkAddress = cDAI;
      let tkAbi = [{
        constant: false,
        inputs: [{
          internalType: "uint256",
          name: "mintAmount",
          type: "uint256",
        }, ],
        name: "mint",
        outputs: [{
          internalType: "uint256",
          name: "",
          type: "uint256",
        }, ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xa0712d68",
      }, ];

      let inter = new ethers.utils.Interface(tkAbi);
      tkData = inter.functions.mint.encode([ethers.utils.parseEther(value)]);
      tkValue = "0";
    }
    substack.adds.push(tkAddress);
    substack.values.push(tkValue);
    substack.datas.push(tkData);

    return substack;
  },
  template: function () {
    let ret =
      "" +
      '<block type="compound_supply" id="compound_supply">' +
      '<value name="VAL">' +
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
      args0: [{
        type: "field_dropdown",
        name: "UNIT",
        options: [
          ["ETH", "ETHER"],
          ["DAI", "DAI"],
        ],
      }, ],
      colour: "#070a0e",
      extensions: ["colours_pen", "output_string"],
    });
  },
};