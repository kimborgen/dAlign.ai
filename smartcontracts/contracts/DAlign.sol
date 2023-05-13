pragma solidity ^0.8.19;
import { SD59x18, sd, convert } from "@prb/math/src/SD59x18.sol";

contract DAlign {

    struct Answer {
        bytes32 id;
        string content;
        SD59x18 eloScore;
        uint256 numberOfRatings;
        address submittedBy;
    }

    struct Prompt {
        bytes32 id;
        string content;
        uint256 totalQuality;
        uint256 numberOfQualityVotes;
        address submittedBy;
    }

    // The K rating used to update ELOSCORE
    SD59x18 K_RATING;
    SD59x18 DEFAULT_ELO_SCORE;

    mapping(bytes32 => Prompt) public prompts;
    mapping(bytes32 => Answer) public answers;
    mapping(bytes32 => bytes32[]) public promptToAnswers;

    event PromptCreated(bytes32 id, string content, address submittedBy);
    event AnswerAdded(bytes32 promptId, bytes32 answerId, string content, address submittedBy);
    event AnswersRated(bytes32 promptId, bytes32 winningAnswerId, bytes32 losingAnswerId, SD59x18 newWinnerElo, SD59x18 newLoserElo, address submittedBy);
    event PromptQualityEvaluated(bytes32 promptId, uint256 newTotalQuality, uint256 newNumberOfQualityVotes, address submittedBy);

    constructor() {
        K_RATING = convert(32);
        DEFAULT_ELO_SCORE = convert(1500);
    }

    function createPrompt(string memory content) public {
        bytes32 id = keccak256(bytes(content));
        // ensure the id doesnt exist 
        require(prompts[id].id == bytes32(0), "The prompt already exits");
        prompts[id] = Prompt(id, content, 0, 0, msg.sender);
        emit PromptCreated(id, content, msg.sender);
    }

    function addAnswer(bytes32 promptId, string memory content) public {
        // You cannot add more than one answer
        //bytes32[] storage _answers = promptToAnswers[promptId];
        //for (uint256 i = 0; i < _answers.length; i++) {
        //    if (answers[_answers[i]].submittedBy == msg.sender) {
        //        revert("You can only add one answer to a prompt");
        //    }
        //}
        bytes32 id = keccak256(abi.encodePacked(content, promptId));
        // ensure that the answer doesnt exist
        require(answers[id].id == bytes32(0), "The answer already exists");

        answers[id] = Answer(id, content, DEFAULT_ELO_SCORE, 0, msg.sender);
        promptToAnswers[promptId].push(id);
        emit AnswerAdded(promptId, id, content, msg.sender);
    }

    function rateAnswers(bytes32 promptId, bytes32 winnerId, bytes32 loserId) public {
        Answer storage winner = answers[winnerId];
        Answer storage loser = answers[loserId];
        //require(winner.submittedBy != msg.sender, "You cannot vote on your own submissions");
        //require(loser.submittedBy != msg.sender, "You cannot vote on your own submissions");

        SD59x18 expectedWinnerScore = convert(1).div(convert(1) + convert(10).pow(loser.eloScore.sub(winner.eloScore)).div(convert(400)));
        SD59x18 expectedLoserScore = convert(1).div(convert(1) + convert(10).pow(winner.eloScore.sub(loser.eloScore)).div(convert(400)));

        winner.eloScore = winner.eloScore.add(K_RATING.mul(convert(1).sub(expectedWinnerScore)));
        loser.eloScore = loser.eloScore.add(K_RATING.mul(convert(0).sub(expectedLoserScore)));

        winner.numberOfRatings += 1;
        loser.numberOfRatings += 1;

        emit AnswersRated(promptId, winnerId, loserId, winner.eloScore, loser.eloScore, msg.sender);
    }

    function evaluatePromptQuality(bytes32 promptId, uint256 quality) public {
        require(quality <= 4, "Quality is not between 0-4");
        //require(prompts[promptId].submittedBy != msg.sender, "You cannot vote on your own submissions");
        prompts[promptId].totalQuality = quality * 25; // Top score 100, lowest score 0
        prompts[promptId].numberOfQualityVotes += 1;
        emit PromptQualityEvaluated(promptId, prompts[promptId].totalQuality, prompts[promptId].numberOfQualityVotes, msg.sender);
    }
}
