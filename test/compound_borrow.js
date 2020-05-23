const { assert } = require("chai");
const { legos } = require("@studydefi/money-legos");

const {
  startChain,
  deployAtomic,
  swapEthForDai,
  encodeForAtomic,
} = require("./testHelpers");

const encoder = (token, value) => {
  const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const comptroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

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
    tkData = inter.functions.mint.encode();
    tkValue = ethers.utils.parseEther(value);
  } else if (token == "DAI") {
    tkAddress = cDAI;
    let tkAbi = [
      {
        constant: false,
        inputs: [
          {
            internalType: "uint256",
            name: "mintAmount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xa0712d68",
      },
    ];

    let inter = new ethers.utils.Interface(tkAbi);
    tkData = inter.functions.mint.encode([ethers.utils.parseEther(value)]);
    tkValue = "0";
  }
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

  //1 Enter Market with funds
  let comptrollerInterface = new ethers.utils.Interface(comptABI);
  let enterData = comptrollerInterface.functions.enterMarkets.encode([
    [tkAddress],
  ]);
  substack.adds.push(comptroller);
  substack.values.push("0");
  substack.datas.push(enterData);

  return substack;
};

describe("Compound Borrow", function () {
  const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const comptroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

  let signer;
  beforeEach(async () => {
    this.timeout(500000);

    ethers.provider = await startChain();
    console.log(await ethers.getSigners());
  });

  it("Should perform flashloans correctly", async function () {
    console.log(await ethers.getSigners());
    let payload = encoder(cETH, "10");
    console.log(payload);
  });
});
