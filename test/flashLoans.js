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
  // Hardcoded Values
  const aave_lendingPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119"; // This will break if aave upgrades
  const aave_core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
  const dai = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  if (loanerAdd == undefined) {
    loanerAdd = "0xdeployedContract";
  }

  let loanerInterface = new ethers.utils.Interface(loanerABI);
  //Encode call to return funds
  let erc20Interface = new ethers.utils.Interface(legos.erc20.abi);
  let fee = value.mul(ethers.utils.bigNumberify("9")).div("10000");
  // let poolReturn;
  // if (token == eth_token) {
  //   poolReturn = encodeForAtomic(aave_core, value.add(fee), "0x0");
  // } else {
  //   poolReturn = erc20Interface.functions.transfer.encode([
  //     aave_core,
  //     value.add(fee),
  //   ]);
  // }

  poolReturn = encodeForAtomic(token, value.add(fee), "0x0");
  console.log("ffv", value.add(fee).toString());
  console.log("prt", poolReturn);

  // Encode call to Loaner Contract
  let loanerData = loanerInterface.functions.initateFlash.encode([
    token,
    value,
    "0x" + poolReturn,
  ]);

  return encodeForAtomic(loanerAdd, ethers.utils.parseEther("10"), loanerData);
};

describe("Aave Flash Loans", function () {
  let loanerContract = {};
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  let substack = encodeForAtomic(
    "0x9C65C5A69e69C67E8e340e893CfCa9A0844d4800",
    ethers.utils.parseEther("3"),
    "0x"
  );

  let aave = {};
  let signer;
  beforeEach(async () => {
    this.timeout(500000);

    ethers.provider = await startChain();
    // signer = await provider.getSigner(0);

    // ethers.provider = provider;

    const LoanerFactory = await ethers.getContractFactory("Loaner");
    loanerContract = await LoanerFactory.deploy();

    const AaveFac = await ethers.getContractFactory("MockAave");
    aave = await AaveFac.deploy({
      value: ethers.utils.parseEther("20").toHexString(),
    });
    console.log("Aave add", aave.address);
  });

  it("Should perform flashloans correctly", async function () {
    this.timeout(500000);
    let payload = "0x";
    let enc = encoder(
      aave.address,
      ethers.utils.parseEther("10"),
      substack,
      loanerContract.address
    );

    // console.log(
    //   await ethers.provider.getCode(
    //     "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8"
    //   )
    // );

    let core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
    let factory = await ethers.getContractFactory("MockAtomic");
    let bef = await ethers.provider.getBalance(aave.address);
    console.log("bef", bef.toString());

    console.log("Atomic deploying...");
    let atomicContract = await factory.deploy(payload + enc, {
      value: ethers.utils.parseUnits("10", "ether").toHexString(),
      gasPrice: 1,
      gasLimit: 6500000,
    });

    console.log("atm", atomicContract.address);

    let value = ethers.utils.parseEther("10");
    let fee = value.mul(ethers.utils.bigNumberify("9")).div("10000");
    let poolReturn = encodeForAtomic(aave.address, value.add(fee), "0x0");

    // await loanerContract.initateFlash(
    //   aave.address,
    //   ethers.utils.parseEther("10"),
    //   payload + poolReturn,
    //   {
    //     value: ethers.utils.parseEther("20").toHexString(),
    //   }
    // );

    let aft = await ethers.provider.getBalance(aave.address);
    console.log("aft", aft.toString());

    // await loanerContract.executeOperation(
    //   atomicContract.address,
    //   ethers.utils.parseEther("2"),
    //   ethers.utils.parseEther("777"),
    //   payload + substack,
    //   {
    //     value: ethers.utils.parseUnits("5", "ether").toHexString(),
    //   }
    // );

    let d = await loanerContract.debug();
    console.log("dbg", d.toString());
    let dby = await loanerContract.dby();
    console.log("dby", dby);
    let snd = await loanerContract.sender();
    console.log("snd", snd);

    // let bef = await ethers.provider.getBalance(aave.address);
    // console.log(bef.toString());

    let rec = await atomicContract.valueRec();
    console.log("rec", rec.toString());
    let val2 = await atomicContract.dd();
    console.log("dd", val2);

    // assert.isTrue(false);
  });
});
