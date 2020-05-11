const { expect } = require("chai");

const { legos } = require("@studydefi/money-legos");

// var ethers = require("ethers");

const ganacheUrl = "http://127.0.0.1:8545";
let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// ganache-cli -d -f https://cloudflare-eth.com

const signer = provider.getSigner(0);
const signer1 = provider.getSigner(1);

const encoder = (token, value, loanerAdd, substack) => {
  // Hardcoded Values
  const aave_provider = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
  const aave_liquidityPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119"; // This will break if aave upgrades
  const init_sig = "8880c488";
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  if (loanerAdd == null) {
    loanerAdd = "0xdeployedContract";
  }

  let encoder = new ethers.utils.AbiCoder();
  let types = ["address", "uint256", "bytes"]; // to, value, data
  let erc20Interface = new ethers.utils.Interface(legos.erc20.abi);
  let amount = value * 1.0009;

  let poolReturn;
  if (token == eth_token) {
    poolReturn = encoder
      .encode(types, [
        aave_liquidityPool,
        ethers.utils.parseUnits(amount, "wei").toString(),
        "0x0",
      ])
      .slice(2);
  } else {
    poolReturn = erc20Interface.functions.transfer.encode([
      aave_liquidityPool,
      amount,
    ]);
  }

  let data = substack; // Result from econded substack

  let loanerCall = loaner.interface.functions.initateFlashLoan.encode([
    token,
    value,
    data,
  ]);
};

describe("Sandwiches", function () {
  it("Should perform flashloans correctly", async function () {
    const LoanerFactory = await ethers.getContractFactory("Loaner");
    let loaner = await LoanerFactory.deploy();

    encoder("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "100000000", "0x0");
  });
});
