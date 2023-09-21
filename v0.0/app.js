const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const ALLOWED_ATTEMPTS = 10;
    const ALLOWED_COLORS = ["r", "g", "b", "y", "c", "m"];
    const COMBINATION_LENGTH = 4;
    let attempts = 1;
    let isCorrectCombination;
    const secretCombination = getSecreteCombination(ALLOWED_COLORS, COMBINATION_LENGTH);
    console.writeln(`Secret Combination: ${secretCombination}`);
    do {
      showHeaders(attempts);
      const proposedCombination = askForValidCombinationProposal(ALLOWED_COLORS, COMBINATION_LENGTH);
      const resultProposedCombination = compare(secretCombination, proposedCombination);
      isCorrectCombination = isCorrect(resultProposedCombination);
      showResult(proposedCombination, resultProposedCombination);
      attempts = increaseByOne(attempts);
      showWinningMessage(isCorrectCombination);
    } while (!isCorrectCombination && attempts <= ALLOWED_ATTEMPTS);
    showLosingMessage(attempts);

    function getSecreteCombination(allowedColors, combinationLength) {
      let secretCombination = [];
      for (let i = 0; i < combinationLength; i++) {
        const randomNumber = generateRandomNumber(allowedColors.length);
        if (!colorIsRepeated(randomNumber, secretCombination, allowedColors)) {
          secretCombination[i] = allowedColors[randomNumber];
        } else {
          i--;
        }
      }
      return secretCombination;

      function generateRandomNumber(length) {
        const MINIMUM_RANGE = 0;
        return Math.floor(Math.random() * (length - MINIMUM_RANGE)) + MINIMUM_RANGE;
      }

      function colorIsRepeated(randomNumber, secretCombination, colors) {
        let itIsRepeated;
        if (secretCombination.length === 0) {
          itIsRepeated = false;
        } else {
          itIsRepeated = false;
          for (let i = 0; !itIsRepeated && i < secretCombination.length; i++) {
            if (secretCombination[i] === colors[randomNumber]) {
              itIsRepeated = true;
            }
          }
        }
        return itIsRepeated;
      }
    }

    function showHeaders(attempts) {
      if (attempts === 1) {
        showGameTitle();
      }
      showAttempts(attempts);

      function showGameTitle() {
        console.writeln("\n\n----- MASTERMIND -----");
      }

      function showAttempts(attempts) {
        console.writeln(`\n${attempts} attempt(s):\n****`);
      }
    }

    function askForValidCombinationProposal(allowedColors, combinationLength) {
      let isValidcombination;
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
        isValidcombination = validateCombination(proposedCombination, allowedColors, combinationLength);
        if (isValidcombination[0] === `false`) {
          console.writeln(isValidcombination[1]);
        }
      } while (isValidcombination[0] === `false`);
      return proposedCombination;

      function validateCombination(proposedCombination, allowedColors, combinationLength) {
        let response = [`true`];
        if (!validateLength(proposedCombination, combinationLength)) {
          response[0] = `false`;
          response[1] = `Wrong proposed combination length!!! (Correct length 4). Please try again`;
          return response;
        }
        if (!validateColors(proposedCombination, allowedColors)) {
          response[0] = `false`;
          response[1] = `Wrong colors, they must be : rgbycm. Please try again`;
          return response;
        }
        if (thereAreRepeatedColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong, there are repeated colors. Please try again`;
        }
        return response;

        function validateLength(proposedCombination, combinationLength) {
          return proposedCombination.length === combinationLength;
        }

        function validateColors(proposedCombination, allowedColors) {
          for (let i = 0; i < proposedCombination.length; i++) {
            let colorIsValid = false;
            for (let j = 0; !colorIsValid && j < allowedColors.length; j++) {
              if (proposedCombination[i] === allowedColors[j]) {
                colorIsValid = true;
              }
            }
            if (!colorIsValid) {
              return colorIsValid;
            }
          }
          return true;
        }

        function thereAreRepeatedColors(combination) {
          let itIsRepeated = false;
          for (let i = 0; !itIsRepeated && i < combination.length - 1; i++) {
            for (let j = i + 1; !itIsRepeated && j < combination.length; j++) {
              if (combination[i] === combination[j]) {
                itIsRepeated = true;
              }
            }
          }
          return itIsRepeated;
        }
      }
    }

    function compare(secretCombination, proposedCombination) {
      const WELL_POSITIONED = `b`;
      const POORLY_POSITIONED = `w`;
      let resultProposedCombination = [];
      for (let i = 0; i < proposedCombination.length; i++) {
        if (verifyCorrectPositioned(proposedCombination[i], secretCombination[i])) {
          resultProposedCombination[i] = WELL_POSITIONED;
        } else if (verifyPoorlyPositioned(secretCombination, proposedCombination[i])) {
          resultProposedCombination[i] = POORLY_POSITIONED;
        } else {
          resultProposedCombination[i] = `Na`;
        }
      }
      return resultProposedCombination;

      function verifyCorrectPositioned(proposedColor, secretColor) {
        return proposedColor === secretColor;
      }

      function verifyPoorlyPositioned(secretCombination, colorToVerify) {
        let isEquals = false;
        for (let j = 0; !isEquals && j < secretCombination.length; j++) {
          if (colorToVerify === secretCombination[j]) {
            isEquals = true;
          }
        }
        return isEquals;
      }
    }

    function isCorrect(resultProposedCombination) {
      let isCorrect = true;
      for (let i = 0; isCorrect && i < resultProposedCombination.length; i++) {
        if (resultProposedCombination[i] === `Na` || resultProposedCombination[i] === `w`) {
          isCorrect = false;
        }
      }
      return isCorrect;
    }

    function increaseByOne(attempts) {
      return attempts + 1;
    }

    function showResult(proposedCombination, resultProposedCombination) {
      console.writeln(`\nResult: ${proposedCombination} --> ${resultProposedCombination}`);
    }

    function showWinningMessage(isCorrectCombination) {
      if (isCorrectCombination) {
        const WINNING_MESSAGE = `:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`;
        console.writeln(WINNING_MESSAGE);
      }
    }

    function showLosingMessage(attempts) {
      if (attempts > ALLOWED_ATTEMPTS) {
        const LOST_MESSAGE = `:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`;
        console.writeln(LOST_MESSAGE);
      }
    }
  }

  function isResumed() {
    let error = false;
    let answer;
    do {
      answer = console.readString(`Do you want play again? (yes / not):`);
      if (answer !== `yes` && answer !== `not`) {
        error = true;
        console.writeln(`Please, responde "yes" or "not".`);
      }
    } while (error);
    return answer === `yes` ? true : false;
  }
}
