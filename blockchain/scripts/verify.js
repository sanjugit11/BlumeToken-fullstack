const { ethers, run } = require("hardhat");

async function verifyContracts() {
 const BLXToken= "0xcb1f54f757381CC8beB9fF404f07a255b7D67266";
 const stBLXToken= "0x08Eb3AB13F82E48A4d56d34f56d5B8618832E4E3";
 const BlumeStaking= "0x69E4a0D23DD6E84af29178C6A78e12141Ce07B84";
 const BlumeVault= "0x944186dbB0c44F69762380c5C430f7D85F8FD4db";

 const MockUSDT= "0x092096Fd1a02EE7DcCbB915d9E4110Db30602603";
 const MockOracle= "0xa07a547B0892D454ff1BB4b7a259aB18137ee6a3";
 const BlumeLP= "0x73B004fDA8F7054D15B002BD9191fE8eddC85EbF";

 try {
    console.log("Verifying BLXToken...");
    await run("verify:verify", {
        address: BLXToken,
        constructorArguments: [],
        contract: "contracts/BLXToken.sol:BLXToken",
    });
 } catch (e) { console.error("BLXToken verify failed:", e.message || e); }
 try {
    console.log("Verifying stBLXToken...");
    await run("verify:verify", {
        address: stBLXToken,
        constructorArguments: [],
        contract: "contracts/stBLXToken.sol:stBLXToken",
    });
 } catch (e) { console.error("stBLXToken verify failed:", e.message || e); }

 try {
    console.log("Verifying BlumeStaking...");
    await run("verify:verify", {
        address: BlumeStaking,
        constructorArguments: [BLXToken, stBLXToken],
        contract: "contracts/BlumeStaking.sol:BlumeStaking",
    });
 } catch (e) { console.error("BlumeStaking verify failed:", e.message || e); }

//  try {
//     console.log("Verifying MockUSDT...");
//     await run("verify:verify", {
//         address: MockUSDT,
//         constructorArguments: [],
//         contract: "contracts/MockUSDT.sol:MockUSDT",
//     });
//  } catch (e) { console.error("MockUSDT verify failed:", e.message || e); }

//  try {
//     console.log("Verifying MockOracle...");
//     await run("verify:verify", {
//         address: MockOracle,
//         constructorArguments: [500000, 6, "BLX / USDT price feed"],
//         contract: "contracts/MockOracle.sol:MockOracle",
//     });
//  } catch (e) { console.error("MockOracle verify failed:", e.message || e); }

//  try {
//     console.log("Verifying BlumeLP...");
//     await run("verify:verify", {
//         address: BlumeLP,
//         constructorArguments: [BLXToken, MockUSDT, MockOracle],
//         contract: "contracts/BlumeLP.sol:BlumeLP",
//     });
//  } catch (e) { console.error("BlumeLP verify failed:", e.message || e); }

 try {
    console.log("Fetching BLX owner as treasury for BlumeVault...");
    const blx = await ethers.getContractAt("BLXToken", BLXToken);
    const treasury = await blx.owner();
    console.log("Verifying BlumeVault with treasury:", treasury);
    await run("verify:verify", {
        address: BlumeVault,
        constructorArguments: [BLXToken, BlumeStaking, treasury],
        contract: "contracts/BlumeVault.sol:BlumeVault",
    });
 } catch (e) { console.error("BlumeVault verify failed:", e.message || e); }

}

verifyContracts();