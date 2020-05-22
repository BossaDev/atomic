// const ethers = require("ethers");
const Ganache = require("ganache-core");

const { legos } = require("@studydefi/money-legos");

const MAINNET_NODE_URL = "https://cloudflare-eth.com";

const getLatestBlock = async () => {
  let provider = new ethers.getDefaultProvider();
  return await provider.getBlockNumber();
};

// start chain forking mainnet on recent block
const startChain = async () => {
  const ganache = Ganache.provider({
    // fork: MAINNET_NODE_URL,
    // network_id: 1,
    // fork_block_number: (await getLatestBlock()) - 10, // forking 10 blocks behind to avoid bumping into sync differences
  });

  const provider = new ethers.providers.Web3Provider(ganache);
  return provider;
};

// swap value (in eth) for dai to enable testing of blocks that require erc20 tokens, returns payload of swap
const swapEthForDai = async function (value) {
  let uniswapExchangeInterface = new ethers.utils.Interface(
    legos.uniswap.exchange.abi
  );

  // encoding for atomic
  let encoder = new ethers.utils.AbiCoder();
  let types = ["address", "uint256", "bytes"]; // to, value, data

  let exchange = "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667"; // hardcoded dai exchange

  let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode([
    "2",
    Math.floor(Date.now() / 1000) + 300,
  ]);
  return encoder
    .encode(types, [exchange, ethers.utils.parseEther(value), calldata])
    .slice(2);
};

const atomicAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "drain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_to",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_value",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_data",
        type: "bytes[]",
      },
    ],
    name: "execute",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const encodeForAtomic = (addresses, weiValue, datas) => {
  let inter = new ethers.utils.Interface(atomicAbi);
  return inter.functions.execute.encode([addresses, weiValue, datas]).slice(2);
};

const deployAtomicFactory = async () => {
  let fac = await ethers.getContractFactory("Atomic");
  let ato = await fac.deploy();
  return ato;
};

// // atomic launch with payload, value in Eth
// const deployAtomic = async (payload, signer, value = "0") => {
//   // let factory = await ethers.getContractFactory("Atomic");
//   let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);
//   let atomicContract = await factory.deploy(payload, {
//     value: ethers.utils.parseUnits(value, "ether").toHexString(),
//     gasPrice: 1,
//     gasLimit: 6721975,
//   });
//   return atomicContract;
// };

module.exports = {
  atomicAbi: atomicAbi,
  // atomicBytecode: atomicBytecode,
  startChain: startChain,
  swapEthForDai: swapEthForDai,
  // deployAtomic: deployAtomic,
  deployAtomicFactory: deployAtomicFactory,
  encodeForAtomic: encodeForAtomic,
};
