function hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

const simulateAtomic = async (blocks) => {
    let topBlocks = getXml(blocks)

    let launchBlock = getLaunchBlock(topBlocks)
    if (!launchBlock) return

    let txParameters = await getTxParameters(launchBlock)

    console.log("Simulating atomic tx:", ...txParameters)
    // send atomic tx
    simulationCall(...txParameters)

}

const simulationCall = async function (value, gas, paramObj) {
    const defaultProvider = ethers.getDefaultProvider("homestead")

    // let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode);
    let atomic = new ethers.utils.Interface(atomicAbi)
    
    let calldata = atomic.functions.execute.encode([paramObj.adds, paramObj.values, paramObj.datas])

    let transaction = {
        to: atomicAddress,
        value: ethers.utils.parseEther(value).toHexString(),
        data: calldata,
    }

    let tx = await defaultProvider.call(transaction)

    console.log("Returned from eth_call: " + tx)
    if (tx == "0x") // failed
        alert("Your transaction is failing with no error message, check if all the blocks have enough balance to perform their operations.")
    else if (tx == "0x0000000000000000000000000000000000000000000000000000000000000001")
        alert("Transaction succeeded.")
    else if (tx.substring(0, 10) == "0x08c379a0") { // signature for Error(string)

        let hexErrorMsg = tx.slice(73).replace(/^0+(\d)|(\d)0+$/gm, '$1$2');

        let errorMessage = hexToString(hexErrorMsg).replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')

        console.log(errorMessage)

        alert("Your transaction is failing: " + errorMessage)
    }
}

