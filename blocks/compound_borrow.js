const compound_borrow = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 borrow %3 %4",
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
  encoder: function (token, amount) {
    const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
    const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
    const comptroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

    let substack = {
      adds: [],
      values: [],
      datas: [],
    };

    //1. Mint the desired collateral
    let tkAddress = cETH;
    let tkData;
    let tkValue;
    let tkAbi = [
      {
        constant: false,
        inputs: [],
        name: "mint",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function",
        signature: "0x1249c58b",
      },
    ];

    let inter = new ethers.utils.Interface(tkAbi);
    tkData = inter.functions.mint.encode([]);

    let v = ethers.utils
      .bigNumberify(amount)
      .div(ethers.utils.bigNumberify("50"));

    tkValue = ethers.utils.parseEther(v.toString());
    substack.adds.push(tkAddress);
    substack.values.push(tkValue);
    substack.datas.push(tkData);

    //2. Enter the desired market
    const comptABI = [
      {
        constant: false,
        inputs: [
          {
            name: "cTokens",
            type: "address[]",
          },
        ],
        name: "enterMarkets",
        outputs: [
          {
            name: "",
            type: "uint256[]",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xc2998238",
      },
    ];

    //2 Enter Market with funds
    let comptrollerInterface = new ethers.utils.Interface(comptABI);
    let enterData = comptrollerInterface.functions.enterMarkets.encode([
      [cETH],
    ]);
    substack.adds.push(comptroller);
    substack.values.push("0");
    substack.datas.push(enterData);

    //3 call Borrow function
    const borrowABI = [
      {
        constant: false,
        inputs: [
          {
            name: "borrowAmount",
            type: "uint256",
          },
        ],
        name: "borrow",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xc5ebeaec",
      },
    ];

    let borrowInt = new ethers.utils.Interface(borrowABI);
    let borrowData = borrowInt.functions.borrow.encode([
      ethers.utils.parseEther(amount),
    ]);
    substack.adds.push(cDAI);
    substack.values.push("0");
    substack.datas.push(borrowData);

    return substack;
  },
  template: function () {
    let ret =
      "" +
      '<block type="compound_borrow" id="compound_borrow">' +
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

Blockly.Blocks["compound_borrow"] = compound_borrow;

Blockly.Blocks["compound-unit-borrow-list"] = {
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
          options: [["DAI", "DAI"]],
        },
      ],
      colour: "#070a0e",
      extensions: ["colours_pen", "output_string"],
    });
  },
};
