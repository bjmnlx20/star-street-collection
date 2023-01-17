import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ethers } from "ethers";

// this works? https://medium.com/zastrin/how-to-save-your-ethereum-dapp-users-from-paying-gas-for-transactions-abd72f15e14d

// or this https://docs.openzeppelin.com/learn/sending-gasless-transactions

function Navbar(object) {
  const location = useLocation();
  
  // const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    object.updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    if (object.currAddress !== "0x") {
      ethereumButton.textContent = "Connected";
      ethereumButton.classList.remove("hover:bg-blue-70");
      ethereumButton.classList.remove("bg-blue-500");
      ethereumButton.classList.add("hover:bg-green-70");
      ethereumButton.classList.add("bg-green-500");
    } else {
      ethereumButton.textContent = "Connect Wallet";
      ethereumButton.classList.remove("hover:bg-green-70");
      ethereumButton.classList.remove("bg-green-500");
      ethereumButton.classList.add("hover:bg-blue-70");
      ethereumButton.classList.add("bg-blue-500");
    }
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        getAddress();
        // window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    let val;

    function disconnectListener() {
      
      object.updateAddress("0x");
      updateButton();
    }

    try {
      val = window.ethereum.isConnected();
      if (!val) return;
      getAddress();
      updateButton();

      // window.ethereum.on("disconnect", disconnectListener);
    } catch (err) {
      console.log(err);
    }
    // return () =>
    //   window.ethereum.removeListener("disconnect", disconnectListener);
  }, [object.currAddress]);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className="flex flex-row justify-between py-3 bg-transparent text-white pr-5">
          {/* <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2" />
              <div className="inline-block font-bold text-xl ml-2">
                ELMO CHRISTMAS
              </div>
            </Link>
          </li> */}
          {/* <li className="w-6/6"> */}
          <ul className="flex flex-row justify-between font-bold mr-10 text-lg">
            {location.pathname === "/" ? (
              <li className="border-b-2 hover:pb-0 p-2">
                <Link to="/">GALLERY</Link>
              </li>
            ) : (
              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/">GALLERY</Link>
              </li>
            )}
            {location.pathname === "/sellNFT" ? (
              <li className="border-b-2 hover:pb-0 p-2">
                <Link to="/sellNFT">List My NFT</Link>
              </li>
            ) : (
              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/sellNFT">List My NFT</Link>
              </li>
            )}
            {location.pathname === "/profile" ? (
              <li className="border-b-2 hover:pb-0 p-2">
                <Link to="/profile">YOUR NFTS</Link>
              </li>
            ) : (
              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/profile">YOUR NFTS</Link>
              </li>
            )}
            <li>
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={connectWebsite}
              >
                Connect Wallet
              </button>
            </li>
          </ul>
          {/* </li> */}
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-sm">
        {object.currAddress !== "0x"
          ? "Now connected!"
          : "Not Connected. Please login to buy NFTs"}{" "}
      </div>
    </div>
  );
}
// {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
export default Navbar;
