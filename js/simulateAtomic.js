const simulateAtomic = async (blocks) => {
    let topBlocks = getXml(blocks)

    let launchBlock = getLaunchBlock(topBlocks)
    if (!launchBlock) return

    let txParameters = await getTxParameters(launchBlock)

    console.log("Simulating atomic tx:", ...txParameters)
    // send atomic tx
    simulationCall(...txParameters)

}

const simulationCall = async function (value, gas, calldata) {
    const defaultProvider = ethers.getDefaultProvider("homestead")
    let encoder = new ethers.utils.AbiCoder();

    let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode);
    let deployTx = await factory.getDeployTransaction(calldata, {
        value: ethers.utils.parseEther(value).toHexString(),
    })

    let tx = await defaultProvider.call(deployTx)

    if (tx == "0x") // failed
        alert("Your transaction is failing, check if all the blocks have enough balance to perform their operations.")
    else
        alert("Transaction succeeded.")

    console.log(tx)
}