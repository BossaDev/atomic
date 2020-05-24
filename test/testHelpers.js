// const ethers = require("ethers");
const Ganache = require("ganache-core");

const {
  legos
} = require("@studydefi/money-legos");

const MAINNET_NODE_URL = "https://cloudflare-eth.com";
// const MAINNET_NODE_URL = 'https://mainnet.infura.io/v3/5fefaaca9194491db58585e0b156d79b';

const getLatestBlock = async () => {
  let provider = new ethers.getDefaultProvider();
  return await provider.getBlockNumber();
};

// start chain forking mainnet on recent block
const startChain = async () => {
  const ganache = Ganache.provider({
    mnemonic: "forward attract escape lottery blade book stay better wreck discover eyebrow eagle",
    fork: MAINNET_NODE_URL,
    network_id: 1,
    fork_block_number: (await getLatestBlock()) - 10, // forking 10 blocks behind to avoid bumping into sync differences
  });

  const provider = new ethers.providers.Web3Provider(ganache);
  return provider;
};

// swap value (in eth) for dai to enable testing of blocks that require erc20 tokens, returns payload of swap
const swapEthForDai = function (value) {
  let uniswapExchangeInterface = new ethers.utils.Interface(
    legos.uniswap.exchange.abi
  );

  let exchange = "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667"; // hardcoded dai exchange

  let calldata = uniswapExchangeInterface.functions.ethToTokenSwapInput.encode([
    "2",
    Math.floor(Date.now() / 1000) + 300,
  ]);
  return {
    adds: [exchange],
    values: [ethers.utils.parseUnits(value, "ether").toString()],
    datas: [calldata]
  }
};

const mergeTxObjs = function (first, second) {
  return {
    adds: first.adds.concat(second.adds),
    values: first.values.concat(second.values),
    datas: first.datas.concat(second.datas)
  }
}

const atomicAbi = [{
    "inputs": [{
      "internalType": "bytes",
      "name": "_proxyBytecode",
      "type": "bytes"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": false,
      "internalType": "address",
      "name": "atomicContract",
      "type": "address"
    }],
    "name": "atomicLaunch",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "name": "atomicNonce",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_token",
      "type": "address"
    }],
    "name": "drain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address[]",
        "name": "_to",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_value",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_data",
        "type": "bytes[]"
      }
    ],
    "name": "execute",
    "outputs": [{
      "internalType": "bool",
      "name": "success",
      "type": "bool"
    }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_owner",
      "type": "address"
    }],
    "name": "getNextAtomic",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address[]",
        "name": "_to",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_value",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_data",
        "type": "bytes[]"
      }
    ],
    "name": "launchAtomic",
    "outputs": [{
      "internalType": "bool",
      "name": "success",
      "type": "bool"
    }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{
      "internalType": "address payable",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

const atomicAddress = "0xE66150F89a0c39C24af30E039E85F3066b236d78" // atomic mainnet address

const encodeForAtomic = (addresses, weiValue, datas) => {
  let inter = new ethers.utils.Interface(atomicAbi);
  return inter.functions.execute.encode([addresses, weiValue, datas]).slice(2);
};

const deployAtomicFactory = async () => {
  let fac = await ethers.getContractFactory("Atomic");
  let ato = await fac.deploy();
  return ato;
};

const getMainnetAtomic = (provider) => {
  let atomicContract = new ethers.Contract(atomicAddress, atomicAbi, provider);
  return atomicContract
}

const getUserAddress = () => {
  return "0xDA8322AEa6C4Eb8C7E2E86EF89FADCf82445172E" // testing user, first address of the mnemonic set on ganache.
}

module.exports = {
  atomicAbi: atomicAbi,
  // atomicBytecode: atomicBytecode,
  startChain: startChain,
  swapEthForDai: swapEthForDai,
  // deployAtomic: deployAtomic,
  deployAtomicFactory: deployAtomicFactory,
  encodeForAtomic: encodeForAtomic,
  mergeTxObjs: mergeTxObjs,
  getMainnetAtomic: getMainnetAtomic,
  atomicAddress: atomicAddress,
  getUserAddress: getUserAddress
}