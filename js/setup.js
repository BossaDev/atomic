// routines that run when starting
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}



async function setup() {
  let urlVars = getUrlVars()

  const ipfs = IpfsHttpClient('ipfs.infura.io', '5001', {
    protocol: "https"
  })

  if (urlVars.tx) {
    txData = await ipfs.get(urlVars.tx)

    let atomicTx = new TextDecoder("utf-8").decode(txData[0].content);

    let xml = Blockly.Xml.textToDom(atomicTx)
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml)
  }

  if (urlVars.embed) {
    // hide stuff
    console.log("hide stuff")
  }


}
setup()

