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
    console.log("test", paramObj)
    let calldata = atomic.functions.execute.encode([paramObj.adds, paramObj.values, paramObj.datas])

    let transaction = {
        to: atomicAddress,
        value: ethers.utils.parseEther(value).toHexString(),
        data: calldata,
    }

    console.log(transaction)


    let tx = await defaultProvider.call(transaction)

    if (tx == "0x") // failed
        alert("Your transaction is failing, check if all the blocks have enough balance to perform their operations.")
    else
        alert("Transaction succeeded.")

    console.log(tx)
}