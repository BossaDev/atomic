"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DSProxy_json_1 = __importDefault(require("./abi/DSProxy.json"));
var DSProxyFactory_json_1 = __importDefault(require("./abi/DSProxyFactory.json"));
var contracts = {
    dsProxy: {
        abi: DSProxy_json_1.default,
    },
    dsProxyFactory: {
        abi: DSProxyFactory_json_1.default,
    },
};
exports.default = contracts;
