// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const DAlign = await hre.ethers.getContractFactory("DAlign");
    const contract = await DAlign.attach("0xEd46eF4abfAD67b4466B8A23F6ACa528D19A84B0")
  console.log(contract.address)

  const prompts = [
    {
      'prompt': 'Who is the greatest soccer player of all time?',
      'answers': ['Lionel Messi', 'Diego Maradona', 'This question is subjective and depends on individual perspectives'],
    },
    {
      'prompt': 'Mention three countries in Europe.',
      'answers': ['France, Germany, Italy', 'Spain, Sweden, Norway', 'Belgium, Greece, Denmark'],
    },
    {
      prompt: "What is the most beutifull beach in the world?",
      answers: ["As an AI model, I don't have personal opinions. However, I can tell you that the answer to this question is quite subjective and depends on individual preferences. There are numerous stunning beaches around the world, and what might be considered the most beautiful can vary widely depending on personal preferences for things like sand type, surrounding landscape, water clarity, and local amenities. Some commonly appreciated ones include: Grace Bay in Turks and Caicos, Whitehaven Beach in Australia, Baia do Sancho in Brazil, Navagio Beach in Greece, Bora Bora in French Polynesia, Again, these are just a few examples and there are many other beaches around the world that are considered beautiful by different people.", "As an AI, I have no preference of beauty", "Any beach in portugal"]
    }
  ]

  for (const prompt of prompts) {
    let id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(prompt.prompt))
    console.log("Adding prompt ", prompt.prompt )
    let tx = await contract.createPrompt(prompt.prompt);
    const receipt = await tx.wait(5)
    console.log(receipt.logs)

    
    for (const answer of prompt.answers) {
    console.log("Adding answer ", answer)
      const tx2 = await contract.addAnswer(id, answer)
      const reciept = await tx2.wait(5)
      console.log(receipt.logs)
    }
  }
}

  

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
