const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

const saveAtomic = () => {
    let xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
    let txName = prompt("Save as", "My Atomic Tx");
    localStorage.setItem(txName, Blockly.Xml.domToText(xml))
    addToTxList(txName)
}

const openAtomic = (txName) => {
    // let txName = prompt("Open transaction", "My Atomic Tx");
    let xml = Blockly.Xml.textToDom(localStorage.getItem(txName))
    console.log(xml)

    Blockly.mainWorkspace.clear()
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml)
}

const shareAtomic = () => {
    const ipfs = IpfsHttpClient('ipfs.infura.io', '5001', {
        protocol: "https"
    })

    let xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)

    const transaction = buffer.Buffer(Blockly.Xml.domToText(xml))
    ipfs.add(transaction, (err, result) => {
        if (err) {
            console.error(err)
            return
        } else {
            console.log(result)
            console.log('https://ipfs.io/ipfs/' + result[0].hash)
            copyToClipboard("https://atomic.ninja/?&tx=" + result[0].hash)
            alert("URL copied to clipboard. Paste it anywhere to share it.")

            // copying to clipboard

        }
    });
}

function addToTxList(txName) {
    var list;
    //is anything in localstorage?
    if (localStorage.getItem('txList') === null) {
        list = [];
    } else {
        list = JSON.parse(localStorage.getItem('txList'));
    }
    list.push(txName);
    localStorage.setItem('txList', JSON.stringify(list));
}