declare const contracts: {
    cToken: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    comptroller: {
        address: string;
        abi: ({
            constant: boolean;
            inputs: {
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        } | {
            inputs: never[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            constant?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            constant?: undefined;
            inputs?: undefined;
            name?: undefined;
            outputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    priceOracle: {
        address: string;
        abi: ({
            constant: boolean;
            inputs: {
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        } | {
            inputs: {
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            constant?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            constant?: undefined;
            inputs?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        })[];
    };
    cEther: {
        decimals: number;
        address: string;
        abi: ({
            constant: boolean;
            inputs: {
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        } | {
            inputs: {
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            constant?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            constant?: undefined;
            inputs?: undefined;
            name?: undefined;
            outputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        })[];
    };
    cDAI: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cSAI: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cBAT: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cZRX: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cUSDC: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cREP: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
    cWBTC: {
        decimals: number;
        address: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            signature: string;
            payable?: undefined;
            stateMutability?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            payable: boolean;
            stateMutability: string;
            type: string;
            inputs?: undefined;
            signature?: undefined;
            anonymous?: undefined;
            name?: undefined;
            constant?: undefined;
            outputs?: undefined;
        } | {
            constant: boolean;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            payable: boolean;
            stateMutability: string;
            type: string;
            signature: string;
            anonymous?: undefined;
        })[];
    };
};
export default contracts;
