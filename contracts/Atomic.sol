pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract AtomicProxy {
    address payable owner = tx.origin;
    address payable factory = msg.sender;
    uint timestamp = now;
    
    receiving () external payable {

    }

    fallback () external payable {
        (bool success, ) = factory.delegatecall(msg.data);
        require (success, "Delegatecall failed");
    }
}

contract Atomic {
    address payable owner = msg.sender;
    address payable self; //needed to keep the storage layout equal to AtomicProxy
    uint timestamp = now;
    
    function launchAtomic(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) external payable returns (bool success) {
        require (_to.length == _value.length && _value.length == _data.length, "Parameters are incorrect");
        AtomicProxy atomicProxy = new AtomicProxy();
        Atomic atomicInterface = Atomic(address(atomicProxy));
        success = atomicInterface.execute(_to, _value, _data);
        atomicInterface.drain(address(0));
    }
    
    function execute(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) payable external returns (bool success) {
        require (timestamp == now, "Execution can only be performed once");
        for (uint i = 0; i < _data.length; i++) {
            (success, ) = payable(_to[i]).call{value: _value[i]}(_data[i]);
            require (success, "Failed executing transaction");
        }
    }
    
    function drain(address _token) public {
        if (_token == address(0))
            owner.call{value: address(this).balance}("");
        else {
            IERC20 token = IERC20(_token);
            token.transfer(owner, token.balanceOf(address(this)));
        }
    }
}