"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProxyRegistry_json_1 = __importDefault(require("./abi/ProxyRegistry.json"));
var DssCdpManager_json_1 = __importDefault(require("./abi/DssCdpManager.json"));
var DssProxyActions_json_1 = __importDefault(require("./abi/DssProxyActions.json"));
// Reference: https://changelog.makerdao.com/
var contracts = {
    proxyRegistry: {
        address: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
        abi: ProxyRegistry_json_1.default,
    },
    dssCdpManager: {
        address: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
        abi: DssCdpManager_json_1.default,
    },
    dssProxyActions: {
        address: "0x82ecd135dce65fbc6dbdd0e4237e0af93ffd5038",
        abi: DssProxyActions_json_1.default,
    },
    jug: {
        address: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
    },
    daiJoin: {
        address: "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
    },
    batAJoin: {
        address: "0x3D0B1912B66114d4096F48A8CEe3A56C231772cA",
    },
    ethAJoin: {
        address: "0x2F0b23f53734252Bda2277357e97e1517d6B042A",
    },
    usdcJoin: {
        address: "0xA191e578a6736167326d05c119CE0c90849E84B7",
    },
};
exports.default = contracts;
