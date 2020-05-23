const { assert } = require("chai");
const { legos } = require("@studydefi/money-legos");

const {
  startChain,
  deployAtomic,
  swapEthForDai,
  encodeForAtomic,
} = require("./testHelpers");

const encoder = (token, amount) => {
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
  let enterData = comptrollerInterface.functions.enterMarkets.encode([[cETH]]);
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
};

const encoderRepay = (token, value, substack) => {
  //   const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

  //   let substack = {
  //     adds: [],
  //     values: [],
  //     datas: [],
  //   };

  //1. Approve the token
  let tkAddress;
  let tkData;
  let tkValue;
  if (token == "DAI") {
    tkAddress = DAI;
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
      cDAI,
      ethers.utils.parseEther(value),
    ]);
    tkValue = "0";
  }
  substack.adds.push(tkAddress);
  substack.values.push(tkValue);
  substack.datas.push(tkData);

  //2. Repay Borrow
  const repayABI = [
    {
      constant: false,
      inputs: [
        {
          internalType: "uint256",
          name: "repayAmount",
          type: "uint256",
        },
      ],
      name: "repayBorrow",
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
      signature: "0x0e752702",
    },
  ];

  //2 Enter Market with funds
  let repayInt = new ethers.utils.Interface(repayABI);
  let repayData = repayInt.functions.repayBorrow.encode([
    ethers.utils.parseEther(value),
  ]);
  substack.adds.push(cDAI);
  substack.values.push("0");
  substack.datas.push(repayData);

  return substack;
};

describe("Compound Borrow and Repay", function () {
  const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  const cDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const comptroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

  let atomicFactory = {};
  let signer;
  beforeEach(async () => {
    this.timeout(500000);

    ethers.provider = await startChain();
    // console.log(await ethers.getSigners());
    const AtomicFactory = await ethers.getContractFactory("Atomic");
    atomicFactory = await AtomicFactory.deploy();
  });

  it("Should borrow tokens correctly", async function () {
    this.timeout(500000);
    // console.log(await ethers.getSigners());
    let payload = encoder("DAI", "50");
    // console.log(payload);

    // console.log(payload);
    await atomicFactory.launchAtomic(
      payload.adds,
      payload.values,
      payload.datas,
      {
        value: ethers.utils.parseUnits("10", "ether").toHexString(),
        gasPrice: 1,
        gasLimit: 6500000,
      }
    );
    let atd = await atomicFactory.factory();
    // console.log("ato", atd);

    let proxy = new ethers.Contract(
      atd,
      atomicFactory.interface.abi,
      ethers.provider
    );

    let cEThCoontract = new ethers.Contract(
      legos.erc20.dai.address,
      legos.erc20.abi,
      ethers.provider
    );
    let bal = await cEThCoontract.balanceOf(atd);
    console.log(bal.toString());
  });

  it("Should borrow and repay tokens correctly", async function () {
    this.timeout(500000);
    // console.log(await ethers.getSigners());
    let p = encoder("DAI", "50");
    // console.log(payload);
    let payload = encoderRepay("DAI", "20", p);
    //console.log(payload);

    // console.log(payload);
    await atomicFactory.launchAtomic(
      payload.adds,
      payload.values,
      payload.datas,
      {
        value: ethers.utils.parseUnits("10", "ether").toHexString(),
        gasPrice: 1,
        gasLimit: 6500000,
      }
    );
    let atd = await atomicFactory.factory();
    // console.log("ato", atd);

    let proxy = new ethers.Contract(
      atd,
      atomicFactory.interface.abi,
      ethers.provider
    );

    let cEThCoontract = new ethers.Contract(
      legos.erc20.dai.address,
      legos.erc20.abi,
      ethers.provider
    );
    let bal = await cEThCoontract.balanceOf(atd);
    console.log(bal.toString());
  });
});
