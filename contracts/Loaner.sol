// Single on chain contract that takes flash loans on behalf of msg.sender(an atomic contract).
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";
// import "./MockAave.sol";
// import "./MockAtomic.sol";


interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}


interface ILendingPool {
    function addressesProvider() external view returns (address);

    function deposit(
        address _reserve,
        uint256 _amount,
        uint16 _referralCode
    ) external payable;

    function redeemUnderlying(
        address _reserve,
        address _user,
        uint256 _amount
    ) external;

    function borrow(
        address _reserve,
        uint256 _amount,
        uint256 _interestRateMode,
        uint16 _referralCode
    ) external;

    function repay(
        address _reserve,
        uint256 _amount,
        address _onBehalfOf
    ) external payable;

    function swapBorrowRateMode(address _reserve) external;

    function rebalanceFixedBorrowRate(address _reserve, address _user) external;

    function setUserUseReserveAsCollateral(
        address _reserve,
        bool _useAsCollateral
    ) external;

    function liquidationCall(
        address _collateral,
        address _reserve,
        address _user,
        uint256 _purchaseAmount,
        bool _receiveAToken
    ) external payable;

    function flashLoan(
        address _receiver,
        address _reserve,
        uint256 _amount,
        bytes calldata _params
    ) external;

    function getReserveConfigurationData(address _reserve)
        external
        view
        returns (
            uint256 ltv,
            uint256 liquidationThreshold,
            uint256 liquidationDiscount,
            address interestRateStrategyAddress,
            bool usageAsCollateralEnabled,
            bool borrowingEnabled,
            bool fixedBorrowRateEnabled,
            bool isActive
        );

    function getReserveData(address _reserve)
        external
        view
        returns (
            uint256 totalLiquidity,
            uint256 availableLiquidity,
            uint256 totalBorrowsFixed,
            uint256 totalBorrowsVariable,
            uint256 liquidityRate,
            uint256 variableBorrowRate,
            uint256 fixedBorrowRate,
            uint256 averageFixedBorrowRate,
            uint256 utilizationRate,
            uint256 liquidityIndex,
            uint256 variableBorrowIndex,
            address aTokenAddress,
            uint40 lastUpdateTimestamp
        );

    function getUserAccountData(address _user)
        external
        view
        returns (
            uint256 totalLiquidityETH,
            uint256 totalCollateralETH,
            uint256 totalBorrowsETH,
            uint256 availableBorrowsETH,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );

    function getUserReserveData(address _reserve, address _user)
        external
        view
        returns (
            uint256 currentATokenBalance,
            uint256 currentUnderlyingBalance,
            uint256 currentBorrowBalance,
            uint256 principalBorrowBalance,
            uint256 borrowRateMode,
            uint256 borrowRate,
            uint256 liquidityRate,
            uint256 originationFee,
            uint256 variableBorrowIndex,
            uint256 lastUpdateTimestamp,
            bool usageAsCollateralEnabled
        );

    function getReserves() external view;
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

    function initateFlash(
        address payable assetToFlashLoan,
        uint256 amountToLoan,
        bytes calldata _params
    ) external payable {
        sender = msg.sender;
        //Get Aave lending pool
        ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());
        // // Ask for a flashloan
        // // LendingPool will now execute the `executeOperation` function above
        // MockAave m = MockAave(assetToFlashLoan);
        lendingPool.flashLoan(
            address(this), // Which address to callback into, alternatively: address(this)
            assetToFlashLoan,
            amountToLoan,
            _params
        );

        // address payable core =  0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3;
        // core.transfer(address(this).balance);
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
