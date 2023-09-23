const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const MAXIMUN_ATTEMPTS = 10;
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
    } while (!isCorrectCombination && attempts <= MAXIMUN_ATTEMPTS);
    showLosingMessage(attempts, MAXIMUN_ATTEMPTS);

    function getSecreteCombination(allowedColors, combinationLength) {
      let secretCombination = [];
      let randomNumber;
      for (let i = 0; i < combinationLength; i++) {
        do {
          randomNumber = generateRandomNumber(allowedColors.length);
        } while (isRepeatedColor(allowedColors[randomNumber], secretCombination));
        secretCombination[i] = allowedColors[randomNumber];
      }
      return secretCombination;

      function generateRandomNumber(length) {
        return parseInt(Math.random() * length);
      }

      function isRepeatedColor(color, secretCombination) {
        let itIsRepeated = false;
        for (let i = 0; !itIsRepeated && i < secretCombination.length; i++) {
          if (color === secretCombination[i]) {
            itIsRepeated = true;
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
      } while (!validateCombination(proposedCombination, allowedColors, combinationLength));
      return proposedCombination;

      function validateCombination(proposedCombination, allowedColors, combinationLength) {
        let isValid = true;
        if (!validateLength(proposedCombination, combinationLength)) {
          console.writeln(`Wrong proposed combination length!!! (Correct length 4). Please try again`);
          isValid = false;
        } else if (!validateColors(proposedCombination, allowedColors)) {
          console.writeln(`Wrong colors, they must be : rgbycm. Please try again`);
          isValid = false;
        } else if (thereAreRepeatedColors(proposedCombination)) {
          console.writeln(`Wrong, there are repeated colors. Please try again`);
          isValid = false;
        }
        return isValid;

        function validateLength(proposedCombination, combinationLength) {
          return proposedCombination.length === combinationLength;
        }

        function validateColors(proposedCombination, allowedColors) {
          let nValidColors = 0;
          for (const proposedColor of proposedCombination) {
            let colorIsValid = false;
            for (let i = 0; !colorIsValid && i < allowedColors.length; i++) {
              if (proposedColor === allowedColors[i]) {
                colorIsValid = true;
                nValidColors++;
              }
            }
          }
          return nValidColors === proposedCombination.length;
        }

        function thereAreRepeatedColors(proposedCombination) {
          let uniqueColors = [];
          for (let color of proposedCombination) {
            if (uniqueColors.indexOf(color) === -1) {
              uniqueColors[uniqueColors.length] = color;
            }
          }
          return uniqueColors.length < proposedCombination.length;
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
        console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
      }
    }

    function showLosingMessage(attempts, maximunAttempts) {
      if (attempts > maximunAttempts) {
        console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
      }
    }
  }

  function isResumed() {
    let error;
    let answer;
    do {
      answer = console.readString(`Do you want play again? (yes / not):`);
      error = answer !== `yes` && answer !== `not`;
      if (error) {
        console.writeln(`Please, responde "yes" or "not".`);
      }
      if (answer === `not`) {
        console.writeln(`End of game. Come back soon`);
      }
    } while (error);
    return answer === `yes` ? true : false;
  }
}
