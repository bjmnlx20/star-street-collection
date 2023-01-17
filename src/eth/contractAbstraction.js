import { ethers } from "ethers";
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';




export async function sendMetaTx(marketplaceX, provider, signer, tokenId) {
  console.log(`now buying tokenId: ${tokenId}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();

  // if you are reading the syntax correctly, there's the message input & message value. they are clearly separated. hopefully.
  const data = marketplaceX.interface.encodeFunctionData('executeSale', [tokenId]);
  const to = marketplaceX.address;
  
  // AH makes sense. after encodeFunctionData, you don't need marketplaceX instance any more
  const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}


// maybe you find a way to make statemutability nonpayable
// and payable field to be empty
// {
//   "type": "function",
//   "name": "executeSale",
//   "constant": false,
//   "stateMutability": "payable",
//   "payable": true,
//   "inputs": [
//       {
//           "type": "uint256",
//           "name": "tokenId"
//       }
//   ],
//   "outputs": []
// },