declare const contracts: {
    poolTokenAbi: ({
        name: string;
        inputs: {
            type: string;
            name: string;
            indexed: boolean;
        }[];
        anonymous: boolean;
        type: string;
        outputs?: undefined;
        constant?: undefined;
        payable?: undefined;
        gas?: undefined;
    } | {
        outputs: never[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        name?: undefined;
        anonymous?: undefined;
        gas?: undefined;
    } | {
        name: string;
        outputs: {
            type: string;
            name: string;
        }[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas: number;
        anonymous?: undefined;
    })[];
    curveAbi: ({
        name: string;
        inputs: ({
            type: string;
            name: string;
            indexed: boolean;
            unit: string;
        } | {
            type: string;
            name: string;
            indexed: boolean;
            unit?: undefined;
        })[];
        anonymous: boolean;
        type: string;
        outputs?: undefined;
        constant?: undefined;
        payable?: undefined;
        gas?: undefined;
    } | {
        outputs: never[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        name?: undefined;
        anonymous?: undefined;
        gas?: undefined;
    } | {
        name: string;
        outputs: never[];
        inputs: ({
            type: string;
            name: string;
            unit?: undefined;
        } | {
            type: string;
            unit: string;
            name: string;
        })[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas: number;
        anonymous?: undefined;
    } | {
        name: string;
        outputs: {
            type: string;
            name: string;
        }[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas: number;
        anonymous?: undefined;
    } | {
        name: string;
        outputs: {
            type: string;
            unit: string;
            name: string;
        }[];
        inputs: never[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas: number;
        anonymous?: undefined;
    })[];
    zapAbi: ({
        outputs: never[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        name?: undefined;
        gas?: undefined;
    } | {
        name: string;
        outputs: {
            type: string;
            name: string;
        }[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas: number;
    } | {
        name: string;
        outputs: never[];
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        payable: boolean;
        type: string;
        gas?: undefined;
    })[];
    cDai_cUsdc: {
        nCoins: number;
        indexes: {
            dai: number;
            usdc: number;
        };
        zap: {
            address: string;
        };
        curve: {
            address: string;
        };
        poolToken: {
            address: string;
        };
    };
    cDai_cUsdc_Usdt: {
        nCoins: number;
        indexes: {
            dai: number;
            usdc: number;
            usdt: number;
        };
        zap: {
            address: string;
        };
        curve: {
            address: string;
        };
        poolToken: {
            address: string;
        };
    };
    yDai_yUsdc_yUsdt_ytUsd: {
        nCoins: number;
        indexes: {
            dai: number;
            usdc: number;
            usdt: number;
            tusd: number;
        };
        zap: {
            address: string;
        };
        curve: {
            address: string;
        };
        poolToken: {
            address: string;
        };
    };
};
export default contracts;
