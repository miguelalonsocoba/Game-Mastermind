const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const ALLOWED_COLORS = ["r", "g", "b", "y", "c", "m"];
    const COMBINATION_LENGTH = 4;
    const MAXIMUN_ATTEMPTS = 10;
    let attempts = 0;
    let isCorrectCombination;
    let resultProposedCombinations = [];
    const secretCombination = getSecreteCombinationWithoutRepeatedColors(ALLOWED_COLORS, COMBINATION_LENGTH);
    console.writeln(`Secret Combination: ${secretCombination}`);
    showTitle();
    do {
      showAttempts(attempts);
      const proposedCombination = getValidProposedCombination(ALLOWED_COLORS, COMBINATION_LENGTH);
      resultProposedCombinations[attempts] = compare(secretCombination, proposedCombination);
      isCorrectCombination = isCorrect(resultProposedCombinations[attempts]);
      showResult(proposedCombination, resultProposedCombinations);
      attempts = increaseByOne(attempts);
    } while (!isCorrectCombination && attempts < MAXIMUN_ATTEMPTS);
    if (isCorrectCombination) {
      showWinningMessage();
    }
    if (attempts > MAXIMUN_ATTEMPTS) {
      showLosingMessage();
    }

    function getSecreteCombinationWithoutRepeatedColors(allowedColors, combinationLength) {
      let secretCombination = [];
      for (let i = 0; i < combinationLength; i++) {
        let randomColor;
        do {
          randomColor = allowedColors[generateRandomNumber(allowedColors.length)];
        } while (isRepeatedColor(randomColor, secretCombination));
        secretCombination[i] = randomColor;
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

    function showTitle() {
      console.writeln("\n\n----- MASTERMIND -----");
    }

    function showAttempts(attempts) {
      console.writeln(`\n${attempts + 1} attempt${attempts !== 0 ? `s` : ``}:\n****`);
    }

    function getValidProposedCombination(allowedColors, combinationLength) {
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
      } while (!validateCombination(proposedCombination, allowedColors, combinationLength));
      return proposedCombination;

      function validateCombination(proposedCombination, allowedColors, combinationLength) {
        0;
        let isValid = true;
        if (!validateLength(proposedCombination, combinationLength)) {
          console.writeln(`Wrong proposed combination length!!! (Correct length 4). Please try again`);
          isValid = false;
        } else if (!validateColors(proposedCombination, allowedColors)) {
          console.writeln(`Wrong colors, they must be : rgbycm. Please try again`);
          isValid = false;
        } else if (validateRepeatedColors(proposedCombination)) {
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

        function validateRepeatedColors(proposedCombination) {
          const COLOR_NO_FOUND = -1;
          let uniqueColors = [];
          for (let color of proposedCombination) {
            if (uniqueColors.indexOf(color) === COLOR_NO_FOUND) {
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

    function showResult(proposedCombination, resultProposedCombinations) {
      let msg = `\nResults:\n`;
      for (let resultProposedCombination of resultProposedCombinations) {
        msg += `${proposedCombination} --> ${resultProposedCombination}\n`;
      }
      console.writeln(msg);
    }

    function increaseByOne(attempts) {
      return ++attempts;
    }

    function showWinningMessage() {
      console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
    }

    function showLosingMessage() {
      console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
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
