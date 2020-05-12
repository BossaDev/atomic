const { expect } = require("chai");

const { legos } = require("@studydefi/money-legos");

const {
  startChain,
  deployAtomic,
  swapEthForDai,
  encodeForAtomic,
} = require("./testHelpers");

// const ganacheUrl = "http://127.0.0.1:8545";
// let provider = new ethers.providers.JsonRpcProvider(ganacheUrl);
// // ganache-cli -d -f https://cloudflare-eth.com

// const signer = provider.getSigner(0);
// const signer1 = provider.getSigner(1);

const encoder = (token, value, loanerAdd, substack) => {
  // Hardcoded Values
  const aave_provider = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
  const aave_liquidityPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119"; // This will break if aave upgrades
  const init_sig = "8880c488";
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  if (loanerAdd == null) {
    loanerAdd = "0xdeployedContract";
  }

  let encSubstack = substack; // Result from econded substack

  //Encode call to return funds
  let erc20Interface = new ethers.utils.Interface(legos.erc20.abi);
  let amount = value * 1.0009;
  let poolReturn;
  if (token == eth_token) {
    poolReturn = encodeForAtomic(aave_liquidityPool, amount, "0x0");
  } else {
    poolReturn = erc20Interface.functions.transfer.encode([
      aave_liquidityPool,
      amount,
    ]);
  }

  // Encode call to Loaner Contract
  let loanerData = loaner.interface.functions.initateFlashLoan.encode([
    token,
    value,
    encSubstack + poolReturn,
  ]);

  return encodeForAtomic(loanerAdd, "0", loanerData);
};

describe("Aave Flash Loans", function () {
  let loanerContract = {};
  const eth_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  beforeEach(async () => {
    this.timeout(100000);

    const provider = await startChain();
    const signer = await provider.getSigner(0);

    const LoanerFactory = await ethers.getContractFactory("Loaner");
    loanerContract = await LoanerFactory.deploy();
  });

  it("Should perform flashloans correctly", async function () {
    let payload = "0x";
    payload += encoder(
      eth_token,
      ethers.utils.parseEther("50"),
      loanerContract
    );
  });
});
