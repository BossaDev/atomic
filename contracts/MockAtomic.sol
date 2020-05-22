pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;


import "./Atomic.sol";

contract MockAtomic{

    uint public valueRec;

    constructor(address factory, bytes memory transactions) public payable {
    }

    // function exec(bytes memory transactions) public payable {
    //     valueRec = 2323;
    //     // dd = transactions;
    //     assembly {
    //         let length := mload(transactions)
    //         let i := 0x20
    //         for { } lt(i, length) { } {
    //             let to := mload(add(transactions, i))
    //             let value := mload(add(transactions, add(i, 0x20)))
    //             let dataLength := mload(add(transactions, add(i, 0x60)))
    //             let data := add(transactions, add(i, 0x80))
    //             let success := call(210000000000000, to, value, data, dataLength, 0, 0)
    //             if eq(success, 0) { revert(0, "One of the transactions failed") }
    //             i := add(i, add(0x80, mul(div(add(dataLength, 0x1f), 0x20), 0x20)))
    //         }
    //     }
    // }

    // function execc() public payable returns(bool){
    //     // dd = transactions;
    //     valueRec = 6666699;
    //     return true;
    // }

    fallback() external payable {
        valueRec = 333;
        // valueRec = msg.value;
        // dd = msg.data;
        // exec(msg.data);
    }
}