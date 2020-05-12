"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Medianizer_json_1 = __importDefault(require("./abi/Medianizer.json"));
var priceFeeds = {
    ethUsdPriceFeed: {
        address: "0x729d19f657bd0614b4985cf1d82531c67569197b",
        abi: Medianizer_json_1.default,
    }
};
exports.default = priceFeeds;
