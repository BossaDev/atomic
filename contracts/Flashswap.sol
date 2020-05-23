pragma solidity =0.6.8;

interface IUniswapV2Callee {
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Exchange {
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Flashswap is IUniswapV2Callee {

    address payable public sender;
    address public weth = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address public asset;

    event emitFallback(uint msgValue, bytes data);
    event emitReceive(uint msgValue);
    event initiate();
    event callback();

    receive() external payable {
        emit emitReceive(msg.value);
    }

    fallback() external payable {
        emit emitFallback(msg.value, msg.data);
    }

    function initateFlashswap(
        address assetToFlashSwap,
        uint amountToLoan,
        bytes calldata _params) 
        external payable{
            sender = msg.sender;
            asset = assetToFlashSwap;
            emit initiate();

            //Get Uniswap V2 Pool (weth => asset)
            address exchangeAddress = IUniswapV2Factory(weth).getPair(address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2), assetToFlashSwap);

            // Flashswap
            // Pool will now execute the `uniswapV2Call` function below
            IUniswapV2Exchange(exchangeAddress).swap(0, amountToLoan, address(this), _params);            
    }

    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        emit callback();

        require(IERC20(asset).transfer(sender, amount1), "Flashswap proxy: Failed transfering tokens back to atomicProxy");
        
        (bool succ,) = sender.call.value(0)(data);
        require(succ, "Flashswap proxy: Callback to atomic failed");

        // block will  have to payback amount before finishing execution of substack
    }
}
