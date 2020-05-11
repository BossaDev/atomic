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
    let value = (block.VALUE) ? await getNestedValue(block.VALUE[0]) : "0" // H/M/L, will use ethgasstation recommended values + 1 wei
    let calldata = "0x"

    calldata += await encodePayload(block.NEXT)

    console.log("gas", gas)
    console.log("value", value)
    console.log("calldata", calldata)

    // send tx
}

// function to recursively get deeply nested values in Blocks
const getNestedValue = async (value) => {
    if (value.value) return value.value
    else if (value.attributes.type && value.attributes.type.value == "ens_resolver") {
        let provider = ethers.getDefaultProvider("homestead")
        let address = await provider.resolveName(getNestedValue(value.VALUE[0])) //.then(console.log);
        return address
    }
    else if (value.FIELD) return await getNestedValue(value.FIELD[0])
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
        for (i = 0; i< blockData.VALUE.length; i++) {
            let value = await getNestedValue(blockData.VALUE[i])
            values.push(value)
        }
    }

    if (blockData.STATEMENT) {
        let statement = await encodePayload(blockData.STATEMENT)
        values.push("0x", statement)
    }

    console.log("encoding", blockData.attributes.type.value, values)
    let encoded = await Blockly.Blocks[blockData.attributes.type.value].encoder(...values)
    let nextBlocks = (blockData.NEXT) ? await encodePayload(blockData.NEXT) : ""

    return encoded + nextBlocks
}

