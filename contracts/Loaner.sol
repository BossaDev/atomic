interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}


interface ILendingPool {
    function flashLoan(
        address _receiver,
        address _reserve,
        uint256 _amount,
        bytes calldata _params
    ) external;
}


contract Loaner {
    address payable public sender;
    address constant ETHADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    ILendingPoolAddressesProvider public addressesProvider = ILendingPoolAddressesProvider(
        0x24a42fD28C976A61Df5D00D0599C34c4f90748c8
    );

    function initateFlashLoan(
        address assetToFlashLoan,
        uint256 amountToLoan,
        bytes calldata _params
    ) external payable {
        //Sender is the atomicProxy contract
        sender = msg.sender;

        //Get Aave lending pool
        ILendingPool lendingPool = ILendingPool(
            addressesProvider.getLendingPool()
        );
        // // Ask for a flashloan
        // // LendingPool will now execute the `executeOperation` function above
        lendingPool.flashLoan(
            address(this), // Which address to callback into, alternatively: address(this)
            assetToFlashLoan,
            amountToLoan,
            _params
        );
    }

    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external {
        
        (bool success, ) = sender.call.value(_amount)(_params);
        
        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

    fallback() external payable {}
}
