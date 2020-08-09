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

    Blockly.mainWorkspace.clear()
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml)
}

var modal

const openMenu = () => {
    let list = JSON.parse(localStorage.getItem('txList'));

    let modalContent = "<h2>Open Transaction</h2>"
    for (i = 0; i < list.length; i++)
        modalContent += "<h4><a href='#' onclick='openAtomic(\"" + list[i] + "\");modal.close()'> " + list[i] + "</a><h4>"

    modal = picoModal(modalContent).show();
    return

    console.log(list)

    let txName = prompt("Please type the name of the tx to open (we'll improve this soon).", "My Atomic Tx");
    openAtomic(txName)
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
            alert("URL copied to clipboard. Paste it anywhere to share it. \n\n It's on IPFS, so if you want it to persist overtime you have to pin it. We recomment https://pinata.cloud/, they allow for pinning of thousasnds of transactions in their free tier. That said, your transaction should be good for the coming days. \n\n The IPFS hash of the transaction is: " + result[0].hash)

            // copying to clipboard

        }
    });
}

const embedAtomic = () => {
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
            copyToClipboard("https://atomic.ninja/?&tx=" + result[0].hash + "&embed=true")
            alert("URL copied to clipboard. iFrame it on your webpage and you'll be good to go (SSL required). \n\n It's on IPFS, so if you want it to persist overtime you have to pin it. We recomment https://pinata.cloud/, they allow for pinning of thousasnds of transactions in their free tier. That said, your transaction should be good for the coming days. \n\n The IPFS hash of the transaction is: " + result[0].hash)

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
    if (!list.includes(txName))
        list.push(txName);
    localStorage.setItem('txList', JSON.stringify(list));
}