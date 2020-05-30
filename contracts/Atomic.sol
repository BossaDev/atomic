pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "./Create2.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

// atomicProxy CANNOT have a constructor, deployed code is used for deployment
contract AtomicProxy {
    address payable public owner; 
    address payable public factory;
    
    constructor() public {
        owner = tx.origin;
        factory = msg.sender;
    }
    
    receive() external payable {}

    fallback () external payable {
        owner = msg.sender;
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
    address payable private factory; //needed to keep the storage layout equal to AtomicProxy
    mapping (address => uint) public atomicNonce;
    bytes proxyBytecode;
    event atomicLaunch(address atomicContract);
    
    constructor (bytes memory _proxyBytecode) public {
        proxyBytecode = _proxyBytecode;
    }
    
    function launchAtomic(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) external payable returns (bool success) {
        require (_to.length == _value.length && _value.length == _data.length, "Parameters are incorrect");
        
        address payable atomicProxy = Create2.deploy(getSalt(msg.sender), proxyBytecode);
        atomicNonce[msg.sender]++;
        emit atomicLaunch(atomicProxy);
        
        bytes memory txData = abi.encodeWithSelector(
                Atomic.execute.selector,
                _to,
                _value,
                _data
            );
        (success, ) = atomicProxy.call{value: msg.value}(txData);
        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
        // atomicInterface.drain(address(0));
    }
    
    function getNextAtomic(address _owner) public view returns (address) {
        return Create2.computeAddress(
            getSalt(_owner),
            proxyBytecode
        );
    }
    
    function getSalt(address _owner) internal view returns (bytes32 salt) {
        return keccak256(abi.encodePacked(_owner,atomicNonce[_owner]));
    }
    
    function execute(address[] calldata _to, uint[] calldata _value, bytes[] calldata _data) payable external returns (bool success) {
        // require (time == now, "Execution can only be performed once");
        owner = payable(_to[0]);
        for (uint i = 0; i < _data.length; i++) {

            // revert block
            if (_value[i] == uint(0 - 1)) // max uint
                revert("Revert Block: Transaction was reverted by the revert block.");

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

contract receiver {
    
    function balance() public view returns (uint) {
        return address(this).balance;
    }
    
    fallback () external payable {
        // revert("fallback do receiver");
    }
    
}