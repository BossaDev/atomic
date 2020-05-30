const loanerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "assetToFlashSwap",
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
    name: "initateFlashswap",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

Blockly.Blocks["uniswap_v2_flashswap"] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "uniswap_v2_flashswap",
      // "message0": Blockly.Msg.CONTROL_REPEAT,
      message0: "%1 %2 Flashswap %3 %4",
      message1: "%1", // Recheio
      // "message2": "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "field_image",
          src: "https://uniswap.exchange/static/media/logo_white.edb44e56.svg",
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
      tooltip:
        "Uniswap V2 flashswap block: Include blocks inside this one, they are the actions while you have the loan in hands. Make sure you have enough to repay (including the 0.03% fee) by the end of the internal transaction (repayment is automatic). After repaying the execution will follow to the block below it.",
      colour: "#ff007b",
      extensions: ["shape_statement"],
    });
  },
  category: "Uniswap",
  encoder: async (value, token, substack, loanerAdd) => {
    if (!substack)
      substack = {
        adds: [],
        values: [],
        datas: [],
      };

    if (loanerAdd == undefined) {
      loanerAdd = "0x4f542647588ce6b2659aec3bd512f52c66d6ba7e";
    }

    let erc20TransferAbi = [
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "dst",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "wad",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    //Encode call to return funds
    let erc20Interface = new ethers.utils.Interface(erc20TransferAbi);

    uniswapFactoryAbi = [
      {
        constant: true,
        inputs: [
          {
            internalType: "address",
            name: "tokenA",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
        ],
        name: "getPair",
        outputs: [
          {
            internalType: "address",
            name: "pair",
            type: "address",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ];

    const provider = ethers.getDefaultProvider();
    let uniswapFactory = new ethers.Contract("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", uniswapFactoryAbi, provider)
    let exchange = await uniswapFactory.getPair("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", token);

    let val = ethers.utils.bigNumberify(ethers.utils.parseEther(value))
    let fee = val.mul(ethers.utils.bigNumberify("3")).div("1000");

    // Transfer tokens back to exchange
    substack.adds.push("0x6b175474e89094c44da98b954eedeac495271d0f");
    substack.values.push("0");
    let token_transfer = erc20Interface.functions.transfer.encode([
      exchange,
      val.add(fee),
    ]);
    substack.datas.push(token_transfer);

    // Get Weth


    // Transfer WETH back to exchange


    let inter = new ethers.utils.Interface(atomicAbi);
    let poolReturn = inter.functions.execute.encode([
      substack.adds,
      substack.values,
      substack.datas,
    ]);

    let loanerInterface = new ethers.utils.Interface(loanerABI);
    // Encode call to Loaner Contract
    let loanerData = loanerInterface.functions.initateFlashswap.encode([
      token,
      value,
      poolReturn,
    ]);

    let daiTransfer = erc20Interface.functions.transfer.encode([
      loanerAdd,
      ethers.utils.parseEther("500").toString(),
    ]);

    console.log(daiTransfer);

    let transferDai = {
      adds: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
      values: ["0"],
      datas: [daiTransfer],
    };

    return mergeTxObjs(transferDai, {
      adds: [loanerAdd],
      values: ["0"],
      datas: [loanerData],
    });
  },
  template: function () {
    return (
      "" +
      '<block type="uniswap_v2_flashswap" id="uniswap_v2_flashswap">' +
      '<value name="VALUE">' +
      '<shadow type="math_whole_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="TOKEN">' +
      '<shadow type="uniswap_flashswap_token_list"></shadow>' +
      "</value>" +
      "</block>"
    );
  },
};

Blockly.Blocks["uniswap_flashswap_token_list"] = {
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
            ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
            ["BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
            ["WETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          ],
        },
      ],
      colour: "#ff007b",
      extensions: ["output_string"],
    });
  },
};
