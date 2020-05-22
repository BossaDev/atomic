const { assert } = require("chai");
const { legos } = require("@studydefi/money-legos");

const {
  startChain,
  deployAtomic,
  swapEthForDai,
  encodeForAtomic,
} = require("./testHelpers");

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
  {
    constant: false,
    inputs: [
      {
        internalType: "address payable",
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
    name: "initateFlash",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
const encoder = (token, value, substack, loanerAdd) => {
  const aave_core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

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
};

describe("Aave Flash Loans", function () {
  let loanerContract = {};
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  let substack = {
    adds: [],
    weiValues: [],
    datas: [],
  };
  let atomicFactory = {};
  let aave = {};
  let signer;
  beforeEach(async () => {
    this.timeout(500000);

    ethers.provider = await startChain();

    const AtomicFactory = await ethers.getContractFactory("Atomic");
    atomicFactory = await AtomicFactory.deploy();

    const LoanerFactory = await ethers.getContractFactory("Loaner");
    loanerContract = await LoanerFactory.deploy();

    const AaveFac = await ethers.getContractFactory("MockAave");
    aave = await AaveFac.deploy({
      value: ethers.utils.parseEther("20").toHexString(),
    });
    // console.log("Aave add", aave.address);
  });

  it("Should perform flashloans correctly", async function () {
    this.timeout(500000);
    let payload = "0x";
    let amount = ethers.utils.parseEther("123");
    // console.log("Atomic Factory", atomicFactory.address);

    //encode call to factory
    let txs = encoder(eth_token, amount, substack, loanerContract.address);

    // console.log(txs);
    let core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";

    let bef = await ethers.provider.getBalance(core);
    // console.log("bef", bef.toString());

    // console.log("Atomic deploying...");
    await atomicFactory.launchAtomic(txs.adds, txs.values, txs.datas, {
      value: ethers.utils.parseUnits("10", "ether").toHexString(),
      gasPrice: 1,
      gasLimit: 6500000,
    });

    // console.log("atm", atomicContract.address);

    // let value = ethers.utils.parseEther("10");
    // let fee = value.mul(ethers.utils.bigNumberify("9")).div("10000");
    // let poolReturn = encodeForAtomic(aave.address, value.add(fee), "0x0");

    // await loanerContract.initateFlash(
    //   aave.address,
    //   ethers.utils.parseEther("10"),
    //   payload + poolReturn,
    //   {
    //     value: ethers.utils.parseEther("20").toHexString(),
    //   }
    // );

    // let aft = await ethers.provider.getBalance(core);
    // console.log("aft", aft.toString());

    // await loanerContract.executeOperation(
    //   atomicContract.address,
    //   ethers.utils.parseEther("2"),
    //   ethers.utils.parseEther("777"),
    //   payload + substack,
    //   {
    //     value: ethers.utils.parseUnits("5", "ether").toHexString(),
    //   }
    // );

    let loaned = await loanerContract.debug();
    // console.log("dbg", loaned.toString());
    // let dby = await loanerContract.dby();
    // console.log("dby", dby);
    // let snd = await loanerContract.sender();
    // console.log("snd", snd);

    // let atd = await atomicFactory.factory();
    // console.log("ato", atd);

    // let proxy = new ethers.Contract(
    //   atd,
    //   atomicFactory.interface.abi,
    //   ethers.provider
    // );
    // console.log(await proxy.owner());

    // let ff = await aave._fee();
    // console.log(ff.toString());

    // let bef = await ethers.provider.getBalance(aave.address);
    // console.log(bef.toString());

    // let rec = await atomicContract.valueRec();
    // console.log("rec", rec.toString());
    // let val2 = await atomicContract.dd();
    // console.log("dd", val2);

    assert.isTrue(loaned.eq(amount));
  });
});
