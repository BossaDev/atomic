"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var erc20_1 = __importDefault(require("../erc20"));
var ilks = {
    batA: {
        symbol: "BAT-A",
        token: { address: erc20_1.default.bat.address },
    },
    ethA: {
        symbol: "ETH-A",
        token: { address: erc20_1.default.eth.address },
    },
    usdcA: {
        symbol: "USDC-A",
        token: { address: erc20_1.default.usdc.address },
    },
};
exports.default = ilks;
