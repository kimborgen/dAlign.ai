const { expect } = require("chai");

describe("DAlign", function () {
  let DAlign;
  let contract;

  beforeEach(async function () {
    DAlign = await ethers.getContractFactory("DAlign");
    contract = await DAlign.deploy();
    await contract.deployed();
  });

  it("Should create a prompt", async function () {
    let content = "What is the capital of France?";
    let id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
    await contract.createPrompt(content);
    expect(await contract.prompts(id)).to.exist;
  });

  it("Should add an answer to a prompt", async function () {
    let content = "What is the capital of France?";
    let id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
    await contract.createPrompt(content);
    let answerContent = "Paris";
    let answerId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(answerContent));
    await contract.addAnswer(id, answerContent);
    expect(await contract.answers(answerId)).to.exist;
  });

  it("Should rate between two answers", async function () {
    let content = "What is the capital of France?";
    let id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
    await contract.createPrompt(content);

    let answerContent = "Paris";
    let answerId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(answerContent));
    await contract.addAnswer(id, answerContent);

    let answerContent2 = "Berlin";
    let answerId2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(answerContent2));
    await contract.addAnswer(id, answerContent2);

    let reciepts = await contract.rateAnswers(id, answerId, answerId2);
    //let answer = await contract.answers(answerId);
    //expect(answer.votes).to.equal(1);

    let answer = await contract.answers(answerId)
    console.log(answer)

    let answer2 = await contract.answers(answerId2)
    console.log(answer2)
  });

  it("Should evaluate a prompt quality", async function () {
    let content = "What is the capital of France?";
    let id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content));
    await contract.createPrompt(content);

    await contract.evaluatePromptQuality(id, 4)

    let answer = await contract.prompts(id)
    console.log(answer)
  })
})
