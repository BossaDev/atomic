'use strict';

var workspace = null;

// routines that run when starting
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function getToolboxElement() {
  var match = location.search.match(/toolbox=([^&]+)/);
  return document.getElementById('toolbox-' + (match ? match[1] : 'categories'));
}

async function setup() {


  let urlVars = getUrlVars()

  const ipfs = IpfsHttpClient('ipfs.infura.io', '5001', {
    protocol: "https"
  })

  let readOnly = false
  let scrollbars = true
  if (urlVars.embed) {
    // hide stuff
    document.getElementById("navbar").style.display = "none";
    document.getElementById("blocklyDiv").style.height = "100%";
    document.getElementById("blocklyDiv").style.top = "-30px";
    document.getElementById("embedLink").href = "https://atomic.ninja?&tx=" + urlVars.tx;
    readOnly = true
    scrollbars = false
  } else {
    document.getElementById("embedLogo").style.display = "none";
  }

  // Create main workspace.
  workspace = Blockly.inject('blocklyDiv', {
    comments: true,
    disable: false,
    collapse: false,
    media: './media/',
    readOnly: readOnly,
    rtl: null,
    scrollbars: scrollbars,
    toolbox: getToolboxElement(),
    toolboxPosition: "start",
    horizontalLayout: false,
    sounds: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.85,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1
    },
    colours: {
      fieldShadow: 'rgba(255, 255, 255, 0.3)',
      dragShadowOpacity: 0.6
    }
  });

  // open tx
  if (urlVars.tx) {

    let txData
    if (urlVars.tx.substr(-1) == "#")
      txData = await ipfs.get(urlVars.tx.slice(0, -1))
    else
      txData = await ipfs.get(urlVars.tx)


    let atomicTx = new TextDecoder("utf-8").decode(txData[0].content);

    let xml = Blockly.Xml.textToDom(atomicTx)
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml)
  }

  if (!urlVars.embed) 
  picoModal(
    "<h2>Welcome to Atomic Ninja!</h2>" +
    "<p>Send complex atomic transactions to Ethereum like never before.</p>" +
    "<h3>Quick Start</h3>" +
    "<p>On the left of the screen there is a list of sorted, disconnected blocks. This is your <b>toolbox</b>.</p>" +
    "<p>Drag the blocks to the <b>workspace</b> at the right, join them and edit their parameters to perform the actions you´d like.</p>" +
    "<p>Start with a hat shaped block such as <img src='./media/hatblock.png' style='width: 11%;'>, as they indicate the beginning of your transaction.</p>" +
    "<p>Once you are done, press <img src='./media/zoom-simulateAtomic.svg'> to simulate your transaction, and <img src='./media/zoom-launchAtomic.svg'> to send it out!</p>" +
    "<p><b>Tip:</b> Hover the blocks for details on how they work.</p>" +
    "<p>For more details, head over to the <a href='./docs.html'>Atomic documentation</a>.</p>"
  ).show();


}