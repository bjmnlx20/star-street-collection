import { useEffect } from "react";
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";
import { transcode } from "buffer";
import sesameTech from "../sesameTechs._4.png"

export default function Marketplace() {
  // console.log('rerender')
  const [currAddress, updateAddress] = useState("0x");

  const sampleData = [
    {price: 0,
      tokenId: 1,
      seller: "a guy",
      owner: "E",
      image: sesameTech,
      name: "Hello there",
      description: "Connect to view collection",}
  ];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  async function fetchData(URL) {
    const response = await fetch(URL);
    const datax = await response.json();
    return datax;
  }

  async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    let transaction = await contract.getAllNFTs();
    

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        

        // axios is one shtr library
        let meta;
        await fetchData(tokenURI).then((datax) => {
          meta = datax;
          
        });

        

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  useEffect(() => {
    if (dataFetched) return;
    if (currAddress === "0x") return;

    async function shtrsyntx() {
      await getAllNFTs();
    }
    shtrsyntx();
  }, [currAddress]);

  return (
    <div>
      <Navbar currAddress={currAddress} updateAddress={updateAddress}></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        {/* <div className="md:text-xl font-bold text-white">plchldr</div> */}
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
