// Single on chain contract that takes flash loans on behalf of msg.sender(an atomic contract).
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";
import "./MockAave.sol";
import "./MockAtomic.sol";

contract Loaner {

    address payable public sender;
    address constant ETHADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant AaveLendingPoolAddressProviderAddress = 0x24a42fD28C976A61Df5D00D0599C34c4f90748c8;

    ILendingPoolAddressesProvider public addressesProvider = ILendingPoolAddressesProvider(
        0x24a42fD28C976A61Df5D00D0599C34c4f90748c8
    );

    uint public debug;
    bytes public dby;
    function initateFlashLoan(
        address assetToFlashLoan,
        uint amountToLoan,
        bytes calldata _params) 
        external payable{
            sender = msg.sender;
            //Get Aave lending pool
            ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());
            // // Ask for a flashloan
            // // LendingPool will now execute the `executeOperation` function above
            lendingPool.flashLoan(
                address(this), // Which address to callback into, alternatively: address(this)
                assetToFlashLoan,
                amountToLoan,
                _params
            );

            // address payable core =  0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3;
            // core.transfer(address(this).balance);
    }

    function initateFlash(
        address payable assetToFlashLoan,
        uint amountToLoan,
        bytes calldata _params) 
        external payable{
            sender = msg.sender;
            //Get Aave lending pool
            // ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());
            // // Ask for a flashloan
            // // LendingPool will now execute the `executeOperation` function above
            MockAave m = MockAave(assetToFlashLoan);
            m.flashLoan(
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
        uint _amount,
        uint _fee,
        bytes calldata _params
    ) external {
        // address payable core =  0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3;
        // core.call.value(_amount + _fee)("");
        //We need to transfer the asset to the reciever.
        // if(_reserve != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE){
        //     IERC20(_reserve).transfer(sender, _amount);
        // }
        // sender.transfer(1);
        // MockAtomic ma = MockAtomic(sender);
        // bool a = ma.execc();
        (bool succ,) = sender.call.value(_amount)(_params);
        // debug = succ? 22: 11;
        // require(succ, "something here");
        // sender.call.value(address(this).balance);
        // sender = msg.sender;
    }

    function() external payable {

    }
}