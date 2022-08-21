// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    // what's the private key?
    // what's the rpc url?
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
}

// verify
async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(err)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
