const isInitialBlock = (blockType) => {
    return (blockType.slice(0, 18) == "atomic_transaction")
}

// finds the initial blocks and prevents multiple initial blocks
const launchAtomic = async (blocks) => {
    let topBlocks = xmlToJSON.parseXML(blocks, {
        mergeCDATA: false, // extract cdata and merge with text nodes
        grokAttr: false, // convert truthy attributes to boolean, etc
        grokText: false, // convert truthy text/attr to boolean, etc
        normalize: false, // collapse multiple spaces to single space
        xmlns: true, // include namespaces as attributes in output
        namespaceKey: '', // tag name for namespace objects
        textKey: 'value', // tag name for text nodes
        valueKey: 'value', // tag name for attribute values
        attrKey: 'attributes', // tag for attr groups
        cdataKey: '', // tag for cdata nodes (ignored if mergeCDATA is true)
        attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
        stripAttrPrefix: false, // remove namespace prefixes from attributes
        stripElemPrefix: false, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
        childrenAsArray: true // force children into arrays
    }).BLOCK

    if (!topBlocks) return
    let launchBlock = null

    topBlocks.forEach(block => {
        if (isInitialBlock(block.attributes.type.value)) {
            if (launchBlock) {
                alert("Only one hat block (atom icon) is allowed in order to initiate a transaction, please remove the unused ones.")
                return
            } else {
                launchBlock = block;
            }
        }
    });

    if (!launchBlock) {
        alert("Use a hat block (atom icon) to initiate an atomic transaction.")
        return
    } else {
        if (!launchBlock.NEXT) {
            alert("You need at least one transaction (along with the atomic block) to launch.")
            return
        }
        launchFromBlock(launchBlock)
    }

}

// launches from a specific block, all validation should be performed before
// this function must receive a hat block (non transactional) and will encode all 
// subsequent blocks, and send out the transaction for signature in the browser
const launchFromBlock = async (block) => {
    if (!isInitialBlock(block.attributes.type.value)) return

    let gas = (block.FIELD) ? await getNestedValue(block.FIELD[0]) : "M" // H/M/L, will use ethgasstation recommended values + 1 wei
    let value = (block.VALUE) ? await getNestedValue(block.VALUE[0]) : "0" 
    let calldata = "0x"

    calldata += await encodePayload(block.NEXT)

    console.log("gas", gas)
    console.log("value", value)
    console.log("calldata", calldata)

    // send atomic tx
    sendAtomicTx(value, gas, calldata)
}

// function to recursively get deeply nested values in Blocks
const getNestedValue = async (value) => {
    if (value.value) return value.value
    else if (value.attributes.type && value.attributes.type.value == "ens_resolver") {
        let ensDomain = await getNestedValue(value.VALUE[0])
        let provider = ethers.getDefaultProvider("homestead")
        let address = await provider.resolveName(ensDomain)
        if (!address) console.error("Error: Unable to resolve", ensDomain, "on ENS.")
        return address
    } else if (value.FIELD) return await getNestedValue(value.FIELD[0])
    else if (value.VALUE) return await getNestedValue(value.VALUE[0])
    else if (value.SHADOW) return await getNestedValue(value.SHADOW[0])
}


// payload encoder, will encode the whole chain of blocks until the end
// for sandwitch blocks the 
const encodePayload = async (block) => {
    if (!block || !block[0] || !block[0].BLOCK) return ""
    let values = []
    let blockData = block[0].BLOCK[0]

    if (blockData.VALUE) {
        for (i = 0; i < blockData.VALUE.length; i++) {
            let value = await getNestedValue(blockData.VALUE[i])
            values.push(value)
        }
    }

    if (blockData.STATEMENT) {
        let statement = await encodePayload(blockData.STATEMENT)
        values.push(statement)
    }

    console.log("encoding", blockData.attributes.type.value, values)
    let encoded = await Blockly.Blocks[blockData.attributes.type.value].encoder(...values)
    let nextBlocks = (blockData.NEXT) ? await encodePayload(blockData.NEXT) : ""

    return encoded + nextBlocks
}

const sendAtomicTx = async function (value, gas, calldata) {
    await ethereum.enable()
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);

    // There is only ever up to one account in MetaMask exposed
    const signer = provider.getSigner();

    let atomicAbi = [{
        "inputs": [{
            "internalType": "bytes",
            "name": "transactions",
            "type": "bytes"
        }],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
    }]
    let atomicBytecode = "0x60806040526040516101a63803806101a68339818101604052602081101561002657600080fd5b810190808051604051939291908464010000000082111561004657600080fd5b8382019150602082018581111561005c57600080fd5b825186600182028301116401000000008211171561007957600080fd5b8083526020830192505050908051906020019080838360005b838110156100ad578082015181840152602081019050610092565b50505050905090810190601f1680156100da5780820380516001836020036101000a031916815260200191505b50604052505050805160205b8181101561015757808301516020820184015160608301850151608084018601600080838386885af1600081141561013d577f4f6e65206f6620746865207472616e73616374696f6e73206661696c656400006000fd5b602080601f850104026080018601955050505050506100e6565b505050603e806101686000396000f3fe6080604052600080fdfea265627a7a72315820312ba706d4dbedb280f08c03c60f5839a8e73114f190dc9b8bbc7c7b2059b18964736f6c634300050f0032"
    let factory = new ethers.ContractFactory(atomicAbi, atomicBytecode, signer);

    let contract = await factory.deploy(calldata, {
        value: ethers.utils.parseEther(value),
        gasPrice: 10, // todo: dynamic gas price
        gasLimit: 10000000
    });

    console.log("Deployed at", contract.address);
}