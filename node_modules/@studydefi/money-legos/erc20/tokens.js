"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ERC20_json_1 = __importDefault(require("./abi/ERC20.json"));
var WETH_json_1 = __importDefault(require("./abi/WETH.json"));
var tokens = {
    eth: {
        symbol: "ETH",
        decimals: 18,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    bat: {
        symbol: "BAT",
        decimals: 18,
        address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
        abi: ERC20_json_1.default,
    },
    dai: {
        symbol: "DAI",
        decimals: 18,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        abi: ERC20_json_1.default,
    },
    rep: {
        symbol: "REP",
        decimals: 18,
        address: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
        abi: ERC20_json_1.default,
    },
    sai: {
        symbol: "SAI",
        decimals: 18,
        address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
        abi: ERC20_json_1.default,
    },
    usdc: {
        symbol: "USDC",
        decimals: 6,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        abi: ERC20_json_1.default,
    },
    weth: {
        symbol: "WETH",
        decimals: 18,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        abi: WETH_json_1.default,
    },
    wbtc: {
        symbol: "WBTC",
        decimals: 8,
        address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        abi: ERC20_json_1.default,
    },
    zrx: {
        symbol: "ZRX",
        decimals: 18,
        address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        abi: ERC20_json_1.default,
    },
};
exports.default = tokens;
