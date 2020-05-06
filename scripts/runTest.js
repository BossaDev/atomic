var ethers = require("ethers");

const testUrl = "http://127.0.0.1:8545";
const url = "https://cloudflare-eth.com";
// ganache-cli -d -f https://cloudflare-eth.com
let cloudflare = new ethers.providers.JsonRpcProvider(url);

let blck;
cloudflare.getBlock("latest").then((block) => {
  blck = block.number;
  console.log("Current block number: ", block.number);
});

// return;

// pega o ultimo bloco
const getBlock = async () => {
  //   let bn = await provider.blockNumber;

  console.log(await provider.getGasPrice());

  //   return bn.toString();
};
// roda o ganache

// let b = console.log(getBlock());
// var exec = require("child_process").exec;

// exec(
//   "ganache-cli -d -f https://cloudflare-eth.com@" + blck,
//   (error, stdout, stderr) => {
//     console.log("Inside exec");
//     if (error) {
//       console.log(`error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   }
// );

// // testes sincronos

// // cria o provider
// testProvider = new ethers.providers.JsonRpcProvider(testUrl);

// return;
// curl -s https://api.blockcypher.com/v1/eth/main | jq -r '.number'

// curl https://api.blockcypher.com/v1/eth/main
