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
    substack.Weivalues.push(value.add(fee));
    substack.datas.push("0x0");
  } else {
    substack.adds.push(token);
    substack.Weivalues.push("0");
    let token_transfer = erc20Interface.functions.transfer.encode([
      aave_core,
      value.add(fee),
    ]);
    substack.datas.push(token_transfer);
  }

  let poolReturn = encodeForAtomic(adds, weiValues, datas);

  let loanerInterface = new ethers.utils.Interface(loanerABI);
  // Encode call to Loaner Contract
  let loanerData = loanerInterface.functions.initateFlash.encode([
    token,
    value,
    poolReturn,
  ]);

  const adds, weiValues, datas = []

  adds.push(loanerAdd);
  weiValues.push(value);
  datas.push(loanerData);
  return encodeForAtomic(loanerAdd, value, loanerData);
};

describe("Aave Flash Loans", function () {
  let loanerContract = {};
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  // let substack = encodeForAtomic(
  //   "0x9C65C5A69e69C67E8e340e893CfCa9A0844d4800",
  //   ethers.utils.parseEther("3"),
  //   "0x"
  // );

  let aave = {};
  let signer;
  beforeEach(async () => {
    this.timeout(500000);

    ethers.provider = await startChain();

    const LoanerFactory = await ethers.getContractFactory("Loaner");
    loanerContract = await LoanerFactory.deploy();

    const AaveFac = await ethers.getContractFactory("MockAave");
    aave = await AaveFac.deploy({
      value: ethers.utils.parseEther("20").toHexString(),
    });
    console.log("Aave add", aave.address);
  });

  // it("Should perform flashloans correctly", async function () {
  //   this.timeout(500000);
  //   let payload = "0x";
  //   let enc = encoder(
  //     aave.address,
  //     ethers.utils.parseEther("10"),
  //     substack,
  //     loanerContract.address
  //   );

  //   // console.log(
  //   //   await ethers.provider.getCode(
  //   //     "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8"
  //   //   )
  //   // );

  //   let core = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
  //   let factory = await ethers.getContractFactory("MockAtomic");
  //   let bef = await ethers.provider.getBalance(aave.address);
  //   console.log("bef", bef.toString());

  //   console.log("Atomic deploying...");
  //   let atomicContract = await factory.deploy(payload + enc, {
  //     value: ethers.utils.parseUnits("10", "ether").toHexString(),
  //     gasPrice: 1,
  //     gasLimit: 6500000,
  //   });

  //   console.log("atm", atomicContract.address);

  //   let value = ethers.utils.parseEther("10");
  //   let fee = value.mul(ethers.utils.bigNumberify("9")).div("10000");
  //   let poolReturn = encodeForAtomic(aave.address, value.add(fee), "0x0");

  //   // await loanerContract.initateFlash(
  //   //   aave.address,
  //   //   ethers.utils.parseEther("10"),
  //   //   payload + poolReturn,
  //   //   {
  //   //     value: ethers.utils.parseEther("20").toHexString(),
  //   //   }
  //   // );

  //   let aft = await ethers.provider.getBalance(aave.address);
  //   console.log("aft", aft.toString());

  //   // await loanerContract.executeOperation(
  //   //   atomicContract.address,
  //   //   ethers.utils.parseEther("2"),
  //   //   ethers.utils.parseEther("777"),
  //   //   payload + substack,
  //   //   {
  //   //     value: ethers.utils.parseUnits("5", "ether").toHexString(),
  //   //   }
  //   // );

  //   let d = await loanerContract.debug();
  //   console.log("dbg", d.toString());
  //   let dby = await loanerContract.dby();
  //   console.log("dby", dby);
  //   let snd = await loanerContract.sender();
  //   console.log("snd", snd);

  //   // let bef = await ethers.provider.getBalance(aave.address);
  //   // console.log(bef.toString());

  //   let rec = await atomicContract.valueRec();
  //   console.log("rec", rec.toString());
  //   let val2 = await atomicContract.dd();
  //   console.log("dd", val2);

  //   // assert.isTrue(false);
  // });

  it("Should encode", async () => {
    let loanerAddress = "0xF7e59f232f4eF7302755176FbF8bE231BA33cA82";
    let aaveAddress = "0x631373B19872701c59926dBDe01d6Ef9c2C98A7a";

    let payload = "0x";
    let enc = encoder(
      aaveAddress,
      ethers.utils.parseEther("1"),
      substack,
      loanerAddress
    );

    console.log("encoded");

    console.log(payload + enc);
  });
});

//0x000000000000000000000000534575faa4b34be7dd2da6ba612255067692ab740000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000124c45f602e0000000000000000000000008894dbaae599e719d21ccb7c69d07e747e36e5440000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000008894dbaae599e719d21ccb7c69d07e747e36e5440000000000000000000000000000000000000000000000000de3e93f3bb0400000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

0x6080604052600080fdfea265627a7a72315820312ba706d4dbedb280f08c03c60f5839a8e73114f190dc9b8bbc7c7b2059b18964736f6c634300050f0032;
0x6080604052600080fdfea265627a7a72315820312ba706d4dbedb280f08c03c60f5839a8e73114f190dc9b8bbc7c7b2059b18964736f6c634300050f0032;
0xe71eca24ea0dd97fe0408c56e34a3d0486f41ce73423c88d38e2206b03963814;
