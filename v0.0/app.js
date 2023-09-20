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
    let attempts = 1;
    let isCorrectCombination;
    const secretCombination = getSecreteCombination(ALLOWED_COLORS);
    console.writeln(`Secret Combination: ${secretCombination}`);
    do {
      showHeaders(attempts);
      const proposedCombination = askForValidCombinationProposal(ALLOWED_COLORS);
      const resultProposedCombination = compare(secretCombination, proposedCombination);
      isCorrectCombination = isCorrect(resultProposedCombination);
      showResult(proposedCombination, resultProposedCombination);
      attempts += increaseByOne();
      showWinningMessage(isCorrectCombination);
    } while (!isCorrectCombination && attempts <= ALLOWED_ATTEMPTS);
    showLosingMessage(attempts);

    function getSecreteCombination(colors) {
      const COMBINATION_LENGTH = 4;
      let secretCombination = [];
      for (let i = 0; i < COMBINATION_LENGTH; i++) {
        const randomNumber = generateRandomNumber(colors.length);
        if (!colorIsRepeated(randomNumber, secretCombination, colors)) {
          secretCombination[i] = colors[randomNumber];
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
          for (let j = 0; !itIsRepeated && j < secretCombination.length; j++) {
            if (secretCombination[j] === colors[randomNumber]) {
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

    function askForValidCombinationProposal(colors) {
      let isValidcombination;
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
        isValidcombination = validateCombination(proposedCombination, colors);
        if (isValidcombination[0] === `false`) {
          console.writeln(isValidcombination[1]);
        }
      } while (isValidcombination[0] === `false`);
      return proposedCombination;

      function validateCombination(proposedCombination, colors) {
        let response = [`true`];
        if (!validateLength(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong proposed combination length!!! (Correct length 4). Please try again`;
          return response;
        }
        if (!validateColors(proposedCombination, colors)) {
          response[0] = `false`;
          response[1] = `Wrong colors, they must be : rgbycm. Please try again`;
          return response;
        }
        if (thereAreRepeatedColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong, there are repeated colors. Please try again`;
        }
        return response;

        function validateLength(proposedCombination) {
          const COMBINATION_LENGTH = 4;
          return proposedCombination.length === COMBINATION_LENGTH;
        }

        function validateColors(proposedCombination, colors) {
          for (let i = 0; i < proposedCombination.length; i++) {
            let colorIsValid = false;
            for (let j = 0; !colorIsValid && j < colors.length; j++) {
              if (proposedCombination[i] === colors[j]) {
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

    function isCorrect(combination) {
      let isCorrect = true;
      for (let i = 0; isCorrect && i < combination.length; i++) {
        if (combination[i] === `Na` || combination[i] === `w`) {
          isCorrect = false;
        }
      }
      return isCorrect;
    }

    function increaseByOne() {
      return 1;
    }

    function showResult(proposedCombination, resultProposedCombination) {
      console.writeln(`Result: ${proposedCombination} --> ${resultProposedCombination}`);
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
