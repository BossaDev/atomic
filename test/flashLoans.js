const { expect } = require("chai");

// var ethers = require("ethers");

const ganacheUrl = "http://127.0.0.1:8545";
let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// ganache-cli -d -f https://cloudflare-eth.com

const signer = provider.getSigner(0);
const signer1 = provider.getSigner(1);

const encoder = (token, value, substack, loaner) => {
  // Hardcoded Values
  const aave_provider = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
  const aave_liquidityPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119"; // This will break if aave upgrades
  const init_sig = "8880c488";

  let encoder = new ethers.utils.AbiCoder();
  let types = ["address", "uint256", "bytes"]; // to, value, data
  console.log(encoder.encode(types, [token, value, substack]));
};

describe("Sandwiches", function () {
  it("Should perform flashloans correctly", async function () {
    const LoanerFactory = await ethers.getContractFactory("Loaner");
    let loaner = await LoanerFactory.deploy();
    // let int = new ethers.Interface(
    //   loaner.abi
    // ).functions.initateFlashLoan.encode([
    //   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //   "100000000",
    //   "0x",
    // ]);
    console.log(
      loaner.interface.functions.initateFlashLoan.encode([
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "100000000",
        "0x",
      ])
    );

    console.log("Calling encoder");
    encoder("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "100000000", "0x0");
  });
});
