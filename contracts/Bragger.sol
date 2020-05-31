pragma solidity 0.6.8;

contract Bragger {
    // maxBrag is stored on chain,
    // for data analythics (top XX), look at Brag event
    uint public maxBrag;
    address public maxBragger;
    event Brag(address bragger, uint balance);
    
    function brag() public {
        emit Brag(msg.sender, address(msg.sender).balance);
        if (address(msg.sender).balance > maxBrag) {
            maxBrag = address(msg.sender).balance;
            maxBragger = msg.sender;
        }
    }
}
