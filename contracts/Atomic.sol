pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract AtomicProxy {
    address payable public owner; 
    address payable public factory;
    
    constructor() public payable {
        owner = tx.origin;
        factory = msg.sender;
    }
    
    receive() external payable {

    }

    fallback () external payable {
        (bool success, ) = factory.delegatecall(msg.data);
        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }
}

contract Atomic {
    address payable public owner = msg.sender;
    address payable public factory; //needed to keep the storage layout equal to AtomicProxy
    
    function launchAtomic(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) external payable returns (bool success) {
        require (_to.length == _value.length && _value.length == _data.length, "Parameters are incorrect");
        AtomicProxy atomicProxy = new AtomicProxy();
        // Atomic atomicInterface = Atomic(address(atomicProxy));
        factory = address(atomicProxy);
        bytes memory txData = abi.encodeWithSelector(
                Atomic.execute.selector,
                _to,
                _value,
                _data
            );
        (success, ) = address(atomicProxy).call{value: msg.value}(txData);
        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
        // success = atomicInterface.execute{value: msg.value}(_to, _value, _data);
        // atomicInterface.drain(address(0));
    }
    
    function execute(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) payable external returns (bool success) {
        // require (time == now, "Execution can only be performed once");
        for (uint i = 0; i < _data.length; i++) {
            (success, ) = payable(_to[i]).call{value: _value[i]}(_data[i]);
            if (!success) {
                assembly {
                    returndatacopy(0, 0, returndatasize())
                    revert(0, returndatasize())
                }
            }
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
    
    fallback () external payable {
        revert("Not correctly encoded for execute or drain.");
    }
}