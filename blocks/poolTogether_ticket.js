const poolTogether_ticket = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 Buy %3 tickets",
      args0: [
        {
          type: "field_image",
          src:
            "./media/pooltogetherBlock.svg",
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
      ],
      colour: "#793DF6",
      category: Blockly.Categories.more,
      tooltip: "Pool Together Ticket: Buy tickets from Pool together.",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  category: "Pool Together",
  encoder: function (value) {
    const Pool = "0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958";
    const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
    let substack = {
      adds: [],
      values: [],
      datas: [],
    };

    //1. Approve DAI

    let tkAddress = DAI;
    let tkData;
    let tkValue;
    let tkAbi = [
      {
        constant: false,
        inputs: [
          {
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
        signature: "0x095ea7b3",
      },
    ];
    let inter = new ethers.utils.Interface(tkAbi);
    tkData = inter.functions.approve.encode([
      Pool,
      ethers.utils.parseEther(value),
    ]);
    tkValue = "0";

    substack.adds.push(tkAddress);
    substack.values.push(tkValue);
    substack.datas.push(tkData);

    // Buy Tickets
    const ticketABI = [
      {
        constant: false,
        inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        name: "depositPool",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    let ticketInter = new ethers.utils.Interface(ticketABI);
    ticketData = ticketInter.functions.depositPool.encode([
      ethers.utils.parseEther(value),
    ]);

    substack.adds.push(Pool);
    substack.values.push("0");
    substack.datas.push(ticketData);

    return substack;
  },
  template: function () {
    let ret =
      "" +
      '<block type="poolTogether_ticket" id="poolTogether_ticket">' +
      '<value name="VAL">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      "</block>";
    return ret;
  },
};

Blockly.Blocks["poolTogether_ticket"] = poolTogether_ticket;
