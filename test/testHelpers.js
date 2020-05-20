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

const atomicBytecode =
  "0x608060405260405161034e38038061034e8339818101604052602081101561002657600080fd5b810190808051604051939291908464010000000082111561004657600080fd5b8382019150602082018581111561005c57600080fd5b825186600182028301116401000000008211171561007957600080fd5b8083526020830192505050908051906020019080838360005b838110156100ad578082015181840152602081019050610092565b50505050905090810190601f1680156100da5780820380516001836020036101000a031916815260200191505b50604052505050805160205b8181101561015d578083015160208201840151606083018501516080840186016000808383868865befe6f672000f16000811415610143577f4f6e65206f6620746865207472616e73616374696f6e73206661696c656400006000fd5b602080601f850104026080018601955050505050506100e6565b5050506101df8061016f6000396000f3fe60806040526004361061001e5760003560e01c806355f865011461006e575b61006c6000368080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610129565b005b6101276004803603602081101561008457600080fd5b81019080803590602001906401000000008111156100a157600080fd5b8201836020820111156100b357600080fd5b803590602001918460018302840111640100000000831117156100d557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610129565b005b805160205b818110156101a5578083015160208201840151606083018501516080840186016000808383868865befe6f672000f1600081141561018b577f4f6e65206f6620746865207472616e73616374696f6e73206661696c656400006000fd5b602080601f8501040260800186019550505050505061012e565b50505056fea265627a7a723158201be1ee6f562d5a199f26cf022ba772068bcdc0581d010a12f508ad9ee5007bdb64736f6c634300050f0032";

const deployAtomicFactory = async () => {
  let fac = await ethers.getContractFactory("Atomic");
  let ato = await factory.deploy();
  return ato;
};

// atomic launch with payload, value in Eth
const deployAtomic = async (payload, signer, value = "0") => {
  // let factory = await ethers.getContractFactory("Atomic");
  let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);
  let atomicContract = await factory.deploy(payload, {
    value: ethers.utils.parseUnits(value, "ether").toHexString(),
    gasPrice: 1,
    gasLimit: 6721975,
  });
  return atomicContract;
};

module.exports = {
  atomicAbi: atomicAbi,
  atomicBytecode: atomicBytecode,
  startChain: startChain,
  swapEthForDai: swapEthForDai,
  deployAtomic: deployAtomic,
  deployAtomicFactory: deployAtomicFactory,
  encodeForAtomic: encodeForAtomic,
};
