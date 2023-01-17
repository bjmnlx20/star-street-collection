import Navbar from "./Navbar";

import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";

import { useState } from "react";
import { ethers } from "ethers";
import { sendMetaTx } from "../eth/contractAbstraction";

export default function NFTPage() {
  async function fetchData(URL) {
    const response = await fetch(URL);
    const datax = await response.json();
    return datax;
  }
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token

    const tokenURI = await contract.tokenURI(tokenId);

    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta;
    await fetchData(tokenURI).then((datax) => {
      meta = datax;
    });

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };

    updateData(item);
    updateDataFetched(true);

    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = userProvider.getSigner();
      //hardcode provider api endpoint
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.g.alchemy.com/v2/JTP5BLJYKfsrd4mhUSnSovyiYaiVMN94",
        5
      );

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        provider
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Forwarding gasless transaction...");
      //run the executeSale function

      let gaslessTransaction = await sendMetaTx(
        contract,
        provider,
        signer,
        tokenId
      );

      // await gaslessTransaction.wait();

      // let transaction = await contract.executeSale(tokenId, {
      //   value: salePrice,
      // });
      // await transaction.wait();

      alert("Transaction sent! Please wait(up to 5 mins) for processing");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar currAddress={currAddress} updateAddress={updateCurrAddress}></Navbar>
      <div className="flex ml-20 mt-20">
        <img src={data.image} alt="" className="w-2/5" />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress === data.owner || currAddress === data.seller ? (
              <div className="text-emerald-700">
                You are the owner of this NFT
              </div>
            ) : data.seller !== "0xA326217D9F15D4e85d3D044650db6c8D06603f98" ? (
              <div className="text-emerald-700">
                This NFT has been sold
              </div>
            ) : (
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => buyNFT(tokenId)}
              >
                Buy this NFT
              </button>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
