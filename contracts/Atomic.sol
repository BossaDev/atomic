pragma solidity 0.5.15;

contract Atomic {

    /// @dev Sends multiple transactions and reverts all if one fails, self destructs immediately
    /// @param transactions Encoded transactions. Each transaction is encoded as a
    ///                     tuple(address,uint256,bytes). The bytes
    ///                     of all encoded transactions are concatenated to form the input.
    constructor(bytes memory transactions) public payable {

        exec(trasanctions);
        // assembly {
        //     let length := mload(transactions)
        //     let i := 0x20
        //     for { } lt(i, length) { } {
        //         let to := mload(add(transactions, i))
        //         let value := mload(add(transactions, add(i, 0x20)))
        //         let dataLength := mload(add(transactions, add(i, 0x60)))
        //         let data := add(transactions, add(i, 0x80))
        //         let success := call(210000000000000, to, value, data, dataLength, 0, 0)
        //         if eq(success, 0) { revert(0, "One of the transactions failed") }
        //         i := add(i, add(0x80, mul(div(add(dataLength, 0x1f), 0x20), 0x20)))
        //     }
        // }
        // selfdestruct(tx.origin);
    }

    function exec(bytes memory transactions) public payable {
        assembly {
            let length := mload(transactions)
            let i := 0x20
            for { } lt(i, length) { } {
                let to := mload(add(transactions, i))
                let value := mload(add(transactions, add(i, 0x20)))
                let dataLength := mload(add(transactions, add(i, 0x60)))
                let data := add(transactions, add(i, 0x80))
                let success := call(210000000000000, to, value, data, dataLength, 0, 0)
                if eq(success, 0) { revert(0, "One of the transactions failed") }
                i := add(i, add(0x80, mul(div(add(dataLength, 0x1f), 0x20), 0x20)))
            }
        }
    }

    fallback() external payable {
        exec(msg.data)
    }
}