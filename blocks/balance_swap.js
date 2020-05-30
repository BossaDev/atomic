const balancerPoolAbi = [{
  "inputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "src",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": true,
  "inputs": [{
    "indexed": true,
    "internalType": "bytes4",
    "name": "sig",
    "type": "bytes4"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "caller",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "LOG_CALL",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "caller",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }],
  "name": "LOG_EXIT",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "caller",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }],
  "name": "LOG_JOIN",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "caller",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }],
  "name": "LOG_SWAP",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "src",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "constant": true,
  "inputs": [],
  "name": "BONE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "BPOW_PRECISION",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "EXIT_FEE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "INIT_POOL_SUPPLY",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_BOUND_TOKENS",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_BPOW_BASE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_FEE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_IN_RATIO",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_OUT_RATIO",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_TOTAL_WEIGHT",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MAX_WEIGHT",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MIN_BALANCE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MIN_BOUND_TOKENS",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MIN_BPOW_BASE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MIN_FEE",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "MIN_WEIGHT",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "src",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "whom",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "denorm",
    "type": "uint256"
  }],
  "name": "bind",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenBalanceOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcInGivenOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenBalanceOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcOutGivenIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolSupply",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "totalWeight",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcPoolInGivenSingleOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "poolAmountIn",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolSupply",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "totalWeight",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcPoolOutGivenSingleIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "poolAmountOut",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolSupply",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "totalWeight",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcSingleInGivenPoolOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolSupply",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "totalWeight",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "poolAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcSingleOutGivenPoolIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenBalanceIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenBalanceOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "tokenWeightOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "calcSpotPrice",
  "outputs": [{
    "internalType": "uint256",
    "name": "spotPrice",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "decreaseApproval",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "uint256",
    "name": "poolAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256[]",
    "name": "minAmountsOut",
    "type": "uint256[]"
  }],
  "name": "exitPool",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "maxPoolAmountIn",
    "type": "uint256"
  }],
  "name": "exitswapExternAmountOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "poolAmountIn",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "poolAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "minAmountOut",
    "type": "uint256"
  }],
  "name": "exitswapPoolAmountIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "finalize",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }],
  "name": "getBalance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getColor",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getController",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getCurrentTokens",
  "outputs": [{
    "internalType": "address[]",
    "name": "tokens",
    "type": "address[]"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }],
  "name": "getDenormalizedWeight",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getFinalTokens",
  "outputs": [{
    "internalType": "address[]",
    "name": "tokens",
    "type": "address[]"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }],
  "name": "getNormalizedWeight",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getNumTokens",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }],
  "name": "getSpotPrice",
  "outputs": [{
    "internalType": "uint256",
    "name": "spotPrice",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }],
  "name": "getSpotPriceSansFee",
  "outputs": [{
    "internalType": "uint256",
    "name": "spotPrice",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getSwapFee",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "getTotalDenormalizedWeight",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }],
  "name": "gulp",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "increaseApproval",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "internalType": "address",
    "name": "t",
    "type": "address"
  }],
  "name": "isBound",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "isFinalized",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "isPublicSwap",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "uint256",
    "name": "poolAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256[]",
    "name": "maxAmountsIn",
    "type": "uint256[]"
  }],
  "name": "joinPool",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "minPoolAmountOut",
    "type": "uint256"
  }],
  "name": "joinswapExternAmountIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "poolAmountOut",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "poolAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "maxAmountIn",
    "type": "uint256"
  }],
  "name": "joinswapPoolAmountOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "denorm",
    "type": "uint256"
  }],
  "name": "rebind",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "manager",
    "type": "address"
  }],
  "name": "setController",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "bool",
    "name": "public_",
    "type": "bool"
  }],
  "name": "setPublicSwap",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "uint256",
    "name": "swapFee",
    "type": "uint256"
  }],
  "name": "setSwapFee",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "minAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "maxPrice",
    "type": "uint256"
  }],
  "name": "swapExactAmountIn",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "spotPriceAfter",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "tokenIn",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "maxAmountIn",
    "type": "uint256"
  }, {
    "internalType": "address",
    "name": "tokenOut",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "maxPrice",
    "type": "uint256"
  }],
  "name": "swapExactAmountOut",
  "outputs": [{
    "internalType": "uint256",
    "name": "tokenAmountIn",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "spotPriceAfter",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "src",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "dst",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amt",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "internalType": "address",
    "name": "token",
    "type": "address"
  }],
  "name": "unbind",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}]

const wethAbi = [{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "guy",
    "type": "address"
  }, {
    "name": "wad",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "src",
    "type": "address"
  }, {
    "name": "dst",
    "type": "address"
  }, {
    "name": "wad",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "wad",
    "type": "uint256"
  }],
  "name": "withdraw",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "dst",
    "type": "address"
  }, {
    "name": "wad",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "deposit",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }, {
    "name": "",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "payable": true,
  "stateMutability": "payable",
  "type": "fallback"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "src",
    "type": "address"
  }, {
    "indexed": true,
    "name": "guy",
    "type": "address"
  }, {
    "indexed": false,
    "name": "wad",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "src",
    "type": "address"
  }, {
    "indexed": true,
    "name": "dst",
    "type": "address"
  }, {
    "indexed": false,
    "name": "wad",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "dst",
    "type": "address"
  }, {
    "indexed": false,
    "name": "wad",
    "type": "uint256"
  }],
  "name": "Deposit",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "src",
    "type": "address"
  }, {
    "indexed": false,
    "name": "wad",
    "type": "uint256"
  }],
  "name": "Withdrawal",
  "type": "event"
}]

Blockly.Blocks["balance_swap"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 swap %3 %4 for %5",
      args0: [{
          type: "field_image",
          src: "https://gblobscdn.gitbook.com/spaces%2F-LtMQYB90ZuO38aKDyto%2Favatar.png",
          width: 50,
          height: 50,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "VALUE",
        },
        {
          type: "input_value",
          name: "TOKEN",
        },
        {
          type: "input_value",
          name: "TOKEN2",
        },
      ],
      // category: Blockly.Categories.pen,
      tooltip: "Balancer Swap: Use to swap eth/tokens on Balancer.",
      colour: "#bebebe",
      extensions: ["shape_statement", "scratch_extension"],
    });
  },
  category: "Balancer",
  encoder: async function (value, tokenFrom, tokenTo) {
    value = ethers.utils.parseEther(value).toString()
    if (tokenFrom == tokenTo)
      throw TypeError("Error (balancer_swap): Cannot swap for the same token, please use different tokens from/to.")

    let balancerPoolInterface = new ethers.utils.Interface(balancerPoolAbi);
    let balancerPoolAddress = "0xE5D1fAB0C5596ef846DCC0958d6D0b20E1Ec4498"
    let wethInterface = new ethers.utils.Interface(wethAbi)
    let wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

    let aproveCalldata = wethInterface.functions.approve.encode([balancerPoolAddress, value])
    let swapCalldata = balancerPoolInterface.functions.swapExactAmountIn.encode([tokenFrom, value, tokenTo, "1", ethers.constants.MaxUint256])

    if (tokenFrom == wethAddress) { // from ether to token

      let depositOnWeth = wethInterface.functions.deposit.encode([])
      return {
        adds: [wethAddress, tokenFrom, balancerPoolAddress],
        values: [value, "0", "0"],
        datas: [depositOnWeth, aproveCalldata, swapCalldata]
      }

    } else if (tokenTo == wethAddress) { // from token to Ether

      let withdrawFromWeth = wethInterface.functions.withdraw.encode([value])

      return {
        adds: [tokenFrom, balancerPoolAddress, wethAddress],
        values: ["0", "0", "0"],
        datas: [aproveCalldata, swapCalldata, withdrawFromWeth]
      }
    } else {
      return {
        adds: [tokenFrom, balancerPoolAddress],
        values: ["0", "0"],
        datas: [aproveCalldata, swapCalldata]
      }
    }
  },
  template: function () {
    return (
      "" +
      '<block type="balance_swap" id="balance_swap">' +
      '<value name="VALUE">' +
      '<shadow type="math_number">' +
      '<field name="NUM">10</field>' +
      "</shadow>" +
      "</value>" +
      '<value name="TOKEN">' +
      '<shadow type="balance_swap-list"></shadow>' +
      "</value>" +
      '<value name="TOKEN2">' +
      '<shadow type="balance_swap-list"></shadow>' +
      "</value>" +
      "</block>"
    );
  },
};

Blockly.Blocks["balance_swap-list"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [{
        type: "field_dropdown",
        name: "TOKEN",
        options: [
          ["ETH", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
          ["MKR", "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"],
        ],
      }, ],
      colour: "#bebebe",
      extensions: ["output_string"],
    });
  },
};