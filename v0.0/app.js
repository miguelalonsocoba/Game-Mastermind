const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    let game = initializeGame();
    let resultProposedCombinations = [];
    let proposedCombinations = [];
    getSecreteCombinationWithoutRepeatedColors(game);
    console.writeln(`Secret Combination: ${game.secretCombination}`);
    do {
      showAttempts(game.attempts);
      proposedCombinations[game.attempts] = setValidProposedCombination(game);
      resultProposedCombinations[game.attempts] = compare(game.secretCombination, proposedCombinations[game.attempts]);
      showResult(proposedCombinations, resultProposedCombinations);
      isCorrect(resultProposedCombinations[game.attempts], game);
      increaseAttempsByOne(game);
    } while (!game.isCorrectCombination && game.attempts < game.MAXIMUN_ATTEMPTS);
    if (game.isCorrectCombination) {
      showWinningMessage();
    }
    if (game.attempts > game.MAXIMUN_ATTEMPTS) {
      showLosingMessage();
    }

    function initializeGame() {
      showTitle();
      return {
        ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
        COMBINATIONS_LENGTH: 4,
        MAXIMUN_ATTEMPTS: 10,
        secretCombination: [],
        attempts: 0,
        isCorrectCombination: false,
      };

      function showTitle() {
        console.writeln("\n\n----- MASTERMIND -----");
      }
    }

    function getSecreteCombinationWithoutRepeatedColors(game) {
      for (let i = 0; i < game.COMBINATIONS_LENGTH; i++) {
        let randomColor;
        do {
          randomColor = game.ALLOWED_COLORS[generateRandomNumber(game.ALLOWED_COLORS.length)];
        } while (isRepeatedColor(randomColor, game.secretCombination));
        game.secretCombination[i] = randomColor;
      }

      function generateRandomNumber(length) {
        return parseInt(Math.random() * length);
      }

      function isRepeatedColor(color, secretCombination) {
        for (let i = 0; i < secretCombination.length; i++) {
          if (color === secretCombination[i]) {
            return true;
          }
        }
        return false;
      }
    }

    function showAttempts(attempts) {
      console.writeln(`\n${attempts + 1} attempt${attempts !== 0 ? `s` : ``}:\n****`);
    }

    function setValidProposedCombination(game) {
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
      } while (!validateCombination(proposedCombination, game));
      return proposedCombination;

      function validateCombination(proposedCombination, { ALLOWED_COLORS, COMBINATIONS_LENGTH }) {
        0;
        let isValid = true;
        if (proposedCombination.length !== COMBINATIONS_LENGTH) {
          console.writeln(`Wrong proposed combination length!!! (Correct length 4). Please try again`);
          isValid = false;
        } else if (!validateColors(proposedCombination, ALLOWED_COLORS)) {
          console.writeln(`Wrong colors, they must be : rgbycm. Please try again`);
          isValid = false;
        } else if (validateRepeatedColors(proposedCombination)) {
          console.writeln(`Wrong, there are repeated colors. Please try again`);
          isValid = false;
        }
        return isValid;

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
        for (let i = 0; !isEquals && i < secretCombination.length; i++) {
          if (colorToVerify === secretCombination[i]) {
            isEquals = true;
          }
        }
        return isEquals;
      }
    }

    function showResult(proposedCombinations, resultProposedCombinations) {
      let msg = `\nResults:\n`;
      for (let i = 0; i < resultProposedCombinations.length; i++) {
        msg += `${proposedCombinations[i]} --> ${resultProposedCombinations[i]}\n`;
      }
      console.writeln(msg);
    }

    function isCorrect(resultProposedCombination, game) {
      let isCorrect = true;
      for (let i = 0; isCorrect && i < resultProposedCombination.length; i++) {
        if (resultProposedCombination[i] === `Na` || resultProposedCombination[i] === `w`) {
          isCorrect = false;
        }
      }
      game.isCorrectCombination = isCorrect;
    }

    function increaseAttempsByOne(game) {
      game.attempts++;
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
