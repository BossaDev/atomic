const atomicAbi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_proxyBytecode",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "atomicContract",
        type: "address",
      },
    ],
    name: "atomicLaunch",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "atomicNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "drain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_to",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_value",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_data",
        type: "bytes[]",
      },
    ],
    name: "execute",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getNextAtomic",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_to",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_value",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_data",
        type: "bytes[]",
      },
    ],
    name: "launchAtomic",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const atomicAddress = "0x0cb0515d286d9b0c805df80c6186f55a1b3c7aad"

const isInitialBlock = (blockType) => {
  return blockType.slice(0, 18) == "atomic_transaction";
};

const getXml = (xmlString) => {
  return xmlToJSON.parseXML(xmlString, {
    mergeCDATA: false, // extract cdata and merge with text nodes
    grokAttr: false, // convert truthy attributes to boolean, etc
    grokText: false, // convert truthy text/attr to boolean, etc
    normalize: false, // collapse multiple spaces to single space
    xmlns: true, // include namespaces as attributes in output
    namespaceKey: "", // tag name for namespace objects
    textKey: "value", // tag name for text nodes
    valueKey: "value", // tag name for attribute values
    attrKey: "attributes", // tag for attr groups
    cdataKey: "", // tag for cdata nodes (ignored if mergeCDATA is true)
    attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
    stripAttrPrefix: false, // remove namespace prefixes from attributes
    stripElemPrefix: false, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
    childrenAsArray: true, // force children into arrays
  }).BLOCK;
};

const getLaunchBlock = (topBlocks) => {
  if (!topBlocks) return;

  let launchBlock;

  topBlocks.forEach((block) => {
    if (isInitialBlock(block.attributes.type.value)) {
      if (launchBlock) {
        alert(
          "Only one hat block (atom icon) is allowed in order to initiate a transaction, please remove the unused ones."
        );
        return;
      } else {
        launchBlock = block;
      }
    }
  });

  if (!launchBlock) {
    alert("Use a hat block (atom icon) to initiate an atomic transaction.");
    return;
  } else {
    if (!launchBlock.NEXT) {
      alert(
        "You need at least one transaction (along with the atomic block) to launch."
      );
      return;
    }
    return launchBlock;
  }
};

const launchAtomic = async (blocks) => {
  let topBlocks = getXml(blocks);

  let launchBlock = getLaunchBlock(topBlocks);
  if (!launchBlock) return;

  let txParameters = await getTxParameters(launchBlock);

  console.log("Sending atomic tx:", ...txParameters);

  // send atomic tx
  sendAtomicTx(...txParameters);
};

const mergeTxObjs = function (first, second) {
  if (!first) return second;
  else if (!second) return first;
  else
    return {
      adds: first.adds.concat(second.adds),
      values: first.values.concat(second.values),
      datas: first.datas.concat(second.datas),
    };
};

// launches from a specific block, all validation should be performed before
// this function must receive a hat block (non transactional) and will encode all
// subsequent blocks, and send out the transaction for signature in the browser
const getTxParameters = async (block) => {
  if (!isInitialBlock(block.attributes.type.value)) return;

  //let gas = (block.FIELD) ? await getNestedValue(block.FIELD[0]) : "M" // H/M/L, will use ethgasstation recommended values + 1 wei
  let gas = "";
  let value = block.VALUE ? await getNestedValue(block.VALUE[0]) : "0";
  let calldata = {
    adds: [],
    values: [],
    datas: [],
  };

  try {
    calldata = mergeTxObjs(calldata, await encodePayload(block.NEXT));
    return [value, gas, calldata];
  } catch (error) {
    alert("\nError encoding for transaction: \n\n" + error.message);
    throw TypeError(error.message);
  }
};

// function to recursively get deeply nested values in Blocks
const getNestedValue = async (value) => {
  if (value.value) return value.value;
  else if (
    value.attributes.type &&
    value.attributes.type.value == "ens_resolver"
  ) {
    let ensDomain = await getNestedValue(value.VALUE[0]);
    let provider = ethers.getDefaultProvider("homestead");
    let address = await provider.resolveName(ensDomain);
    if (!address)
      throw TypeError("Error: Unable to resolve '" + ensDomain + "' on ENS.");
    return address;
  } else if (value.FIELD) return await getNestedValue(value.FIELD[0]);
  else if (value.VALUE) return await getNestedValue(value.VALUE[0]);
  else if (value.SHADOW) return await getNestedValue(value.SHADOW[0]);
};

// payload encoder, will encode the whole chain of blocks until the end
// for sandwitch blocks the
const encodePayload = async (block) => {
  if (!block || !block[0] || !block[0].BLOCK)
    return {
      adds: [],
      values: [],
      datas: [],
    };
  let values = [];
  let blockData = block[0].BLOCK[0];

  if (blockData.VALUE) {
    for (i = 0; i < blockData.VALUE.length; i++) {
      let value = await getNestedValue(blockData.VALUE[i]);
      values.push(value);
    }
  }

  if (blockData.STATEMENT) {
    let statement = await encodePayload(blockData.STATEMENT);
    values.push(statement);
  }

  console.log("encoding", blockData.attributes.type.value, values);
  let encoded = await Blockly.Blocks[blockData.attributes.type.value].encoder(
    ...values
  );
  let nextBlocks = blockData.NEXT
    ? await encodePayload(blockData.NEXT)
    : {
        adds: [],
        values: [],
        datas: [],
      };

  return mergeTxObjs(encoded, nextBlocks); // encoded + nextBlocks
};

const sendAtomicTx = async function (value, gas, calldata) {
  try {
    // Standard metamask connect
    await ethereum.enable()
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);

    // There is only ever up to one account in MetaMask exposed
    const signer = provider.getSigner();

    // launch the atomic tx
    if (confirm("☠️ Sending atomic transactions out is currently not recommended. This is a pre alpha, hackathon version, please keep your funds away. ☠️ \n\nAre you sure you want to send this transaction out?")) {
      // lift off!!!
      const atomic = new ethers.Contract(atomicAddress, atomicAbi, signer)

      const unsignedData = atomic.interface.functions["launchAtomic"].encode([calldata.adds, calldata.values, calldata.datas])
      console.log("unsigned tx data", unsignedData)

      tx = await atomic.launchAtomic(calldata.adds, calldata.values, calldata.datas) // no balance will fail this
      await tx.wait();
      
      alert("Atomic Tx mined: ", tx.hash)
    } else {
      console.error("User declined to send alpha tx.")
    }

    // console.log("Deployed at", contract.address);
  } catch (error) {
    console.error(error);
    alert(
      "\nError sending transaction: \n\n" +
        error.message +
        "\n\nEnsure you are using an Ethereum compatible browser, and approve the request to connect."
    );
  }
};
