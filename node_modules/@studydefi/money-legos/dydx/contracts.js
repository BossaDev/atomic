"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SoloMargin_json_1 = __importDefault(require("./abi/SoloMargin.json"));
var PayableProxyForSoloMargin_json_1 = __importDefault(require("./abi/PayableProxyForSoloMargin.json"));
var PolynomialInterestSetter_json_1 = __importDefault(require("./abi/PolynomialInterestSetter.json"));
var Expiry_json_1 = __importDefault(require("./abi/Expiry.json"));
var ExpiryV2_json_1 = __importDefault(require("./abi/ExpiryV2.json"));
var DaiPriceOracle_json_1 = __importDefault(require("./abi/DaiPriceOracle.json"));
var SaiPriceOracle_json_1 = __importDefault(require("./abi/SaiPriceOracle.json"));
var WethPriceOracle_json_1 = __importDefault(require("./abi/WethPriceOracle.json"));
var UsdcPriceOracle_json_1 = __importDefault(require("./abi/UsdcPriceOracle.json"));
var AdminImpl_json_1 = __importDefault(require("./abi/AdminImpl.json"));
var OperationImpl_json_1 = __importDefault(require("./abi/OperationImpl.json"));
var LiquidatorProxyV1ForSoloMargin_json_1 = __importDefault(require("./abi/LiquidatorProxyV1ForSoloMargin.json"));
var LimitOrders_json_1 = __importDefault(require("./abi/LimitOrders.json"));
var StopLimitOrders_json_1 = __importDefault(require("./abi/StopLimitOrders.json"));
var CanonicalOrders_json_1 = __importDefault(require("./abi/CanonicalOrders.json"));
var SignedOperationProxy_json_1 = __importDefault(require("./abi/SignedOperationProxy.json"));
var Refunder_json_1 = __importDefault(require("./abi/Refunder.json"));
var contracts = {
    soloMargin: {
        address: "0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e",
        abi: SoloMargin_json_1.default,
    },
    payableProxyForSoloMargin: {
        abi: PayableProxyForSoloMargin_json_1.default,
        address: "0xa8b39829cE2246f89B31C013b8Cde15506Fb9A76",
    },
    polynomialInterestSetter: {
        abi: PolynomialInterestSetter_json_1.default,
        address: "0xaEE83ca85Ad63DFA04993adcd76CB2B3589eCa49",
    },
    expiry: {
        abi: Expiry_json_1.default,
        address: "0x0ECE224FBC24D40B446c6a94a142dc41fAe76f2d",
    },
    expiryV2: {
        abi: ExpiryV2_json_1.default,
        address: "0x739A1DF6725657f6a16dC2d5519DC36FD7911A12",
    },
    daiPriceOracle: {
        abi: DaiPriceOracle_json_1.default,
        address: "0x0fBd14718d8FAB8f9f40Ee5c5612b1F0717100A2",
    },
    saiPriceOracle: {
        abi: SaiPriceOracle_json_1.default,
        address: "0x787F552BDC17332c98aA360748884513e3cB401a",
    },
    wethPriceOracle: {
        abi: WethPriceOracle_json_1.default,
        address: "0xf61AE328463CD997C7b58e7045CdC613e1cFdb69",
    },
    usdcPriceOracle: {
        abi: UsdcPriceOracle_json_1.default,
        address: "0x52f1c952A48a4588f9ae615d38cfdbf8dF036e60",
    },
    adminImpl: {
        abi: AdminImpl_json_1.default,
        address: "0x8a6629fEba4196E0A61B8E8C94D4905e525bc055",
    },
    operationImpl: {
        abi: OperationImpl_json_1.default,
        address: "0x56E7d4520ABFECf10b38368b00723d9BD3c21ee1",
    },
    liquidatorProxyV1ForSoloMargin: {
        abi: LiquidatorProxyV1ForSoloMargin_json_1.default,
        address: "0xD4B6cd147ad8A0D5376b6FDBa85fE8128C6f0686",
    },
    limitOrders: {
        abi: LimitOrders_json_1.default,
        address: "0xDEf136D9884528e1EB302f39457af0E4d3AD24EB",
    },
    stopLimitOrders: {
        abi: StopLimitOrders_json_1.default,
        address: "0xbFb635e8c6689ac3874aD9A60FaB1c29270f1710",
    },
    canonicalOrders: {
        abi: CanonicalOrders_json_1.default,
        address: "0xCd81398895bEa7AD9EFF273aeFFc41A9d83B4dAD",
    },
    signedOperationProxy: {
        abi: SignedOperationProxy_json_1.default,
        address: "0x2a842bC64343FAD4Ec4a8424ba7ff3c0A70b6e55",
    },
    refunder: {
        abi: Refunder_json_1.default,
        address: "0x7454dF5d0758D4E7A538c3aCF4841FA9137F0f74",
    },
};
exports.default = contracts;
