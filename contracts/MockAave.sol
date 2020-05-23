pragma solidity 0.6.8;

import "./Loaner.sol";

contract MockAave {

    uint public _amount;
    uint public _fee;

    constructor() public payable {

    }

    function flashLoan(address payable reciever, address asset, uint amount, bytes calldata _params) external {
        reciever.call.value(amount)("");
        uint fee = amount * 9 / 10000;
        Loaner(reciever).executeOperation(asset,amount,fee,_params);
    }

    fallback() external payable {
        _fee = msg.value;
    }
}