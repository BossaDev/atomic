// Single on chain contract that takes flash loans on behalf of msg.sender(an atomic contract).
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";


contract Loaner {

    address private sender;
    address constant ETHADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant AaveLendingPoolAddressProviderAddress = 0x24a42fD28C976A61Df5D00D0599C34c4f90748c8;

    ILendingPoolAddressesProvider public addressesProvider = ILendingPoolAddressesProvider(
        0x24a42fD28C976A61Df5D00D0599C34c4f90748c8
    );

    function initateFlashLoan(
        address assetToFlashLoan,
        uint amountToLoan,
        bytes calldata _params) 
        external {

            sender = msg.sender;
            // Get Aave lending pool
            ILendingPool lendingPool = ILendingPool(
                ILendingPoolAddressesProvider(AaveLendingPoolAddressProviderAddress)
                    .getLendingPool()
            );

            // Ask for a flashloan
            // LendingPool will now execute the `executeOperation` function above
            lendingPool.flashLoan(
                sender, // Which address to callback into, alternatively: address(this)
                assetToFlashLoan,
                amountToLoan,
                _params
            );
    }

    function executeOperation(
        address _reserve,
        uint _amount,
        uint _fee,
        bytes calldata _params
    ) payable external {

        //We need to transfer the asset to the reciever.
        if(_reserve != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE){
            IERC20(_reserve).transfer(sender, _amount);
        }
        sender.call.value(msg.value)(_params);
    }
}