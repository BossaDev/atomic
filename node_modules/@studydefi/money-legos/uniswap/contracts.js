"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Exchange_json_1 = __importDefault(require("./abi/Exchange.json"));
var Factory_json_1 = __importDefault(require("./abi/Factory.json"));
var contracts = {
    factory: {
        address: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
        abi: Factory_json_1.default,
    },
    exchange: {
        abi: Exchange_json_1.default,
    },
};
exports.default = contracts;
