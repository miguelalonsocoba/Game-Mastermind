const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const game = initializeGame();
    console.writeln(`Secret Combination: ${game.secretCombination}`);
    do {
      showAttempts(game);
      setValidProposedCombination(game);
      compareProposedCombinationWithSecretCombination(game);
      showComparisonResult(game);
      isCorrectCombination(game);
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
      let game = {
        ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
        COMBINATIONS_LENGTH: 4,
        MAXIMUN_ATTEMPTS: 10,
        secretCombination: [],
        attempts: 0,
        isCorrectCombination: false,
        proposedCombinations: [],
        resultProposedCombinations: [[]], //Change name to "restultsOfComparingCombinations"
      };
      setSecretCombinationWithoutRepeatedColors(game);
      return game;

      function showTitle() {
        console.writeln("\n\n----- MASTERMIND -----");
      }

      function setSecretCombinationWithoutRepeatedColors(game) {
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
    }

    function showAttempts({ attempts }) {
      console.writeln(`\n${attempts + 1} attempt${attempts !== 0 ? `s` : ``}:\n****`);
    }

    function setValidProposedCombination(game) {
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
      } while (!validateCombination(proposedCombination, game));
      game.proposedCombinations[game.attempts] = proposedCombination;

      function validateCombination(proposedCombination, { ALLOWED_COLORS, COMBINATIONS_LENGTH }) {
        const MSG_ERRORS = {
          length: `Wrong proposed combination length!!! (Correct length 4). Please try again`,
          colorsNotValid: `Wrong colors, they must be : rgbycm. Please try again`,
          repeatedColors: `Wrong, there are repeated colors. Please try again`,
        };
        if (proposedCombination.length !== COMBINATIONS_LENGTH) {
          console.writeln(MSG_ERRORS.length);
          return false;
        } else if (!validateColors(proposedCombination, ALLOWED_COLORS)) {
          console.writeln(MSG_ERRORS.colorsNotValid);
          return false;
        } else if (!validateRepeatedColors(proposedCombination)) {
          console.writeln(MSG_ERRORS.repeatedColors);
          return false;
        }
        return true;

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
          const NO_FOUND = -1;
          let uniqueColors = [];
          for (let color of proposedCombination) {
            if (uniqueColors.indexOf(color) === NO_FOUND) {
              uniqueColors[uniqueColors.length] = color;
            }
          }
          return uniqueColors.length === proposedCombination.length;
        }
      }
    }

    function compareProposedCombinationWithSecretCombination(game) {
      const WELL_POSITIONED = `b`;
      const POORLY_POSITIONED = `w`;
      const EMPTY = `Na`;
      let comparisonResult = [];
      for (let i = 0; i < game.proposedCombinations[game.attempts].length; i++) {
        if (verifyCorrectPositioned(game.proposedCombinations[game.attempts][i], game.secretCombination[i])) {
          comparisonResult[i] = WELL_POSITIONED;
        } else if (verifyPoorlyPositioned(game.secretCombination, game.proposedCombinations[game.attempts][i])) {
          comparisonResult[i] = POORLY_POSITIONED;
        } else {
          comparisonResult[i] = EMPTY;
        }
      }
      game.resultProposedCombinations[game.attempts] = comparisonResult;

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

    function showComparisonResult(game) {
      let msg = `\nResults:\n`;
      for (let i = 0; i < game.resultProposedCombinations.length; i++) {
        msg += `${game.proposedCombinations[i]} --> ${game.resultProposedCombinations[i]}\n`;
      }
      console.writeln(msg);
    }

    function isCorrectCombination(game) {
      let isCorrect = true;
      for (let i = 0; isCorrect && i < game.resultProposedCombinations[game.attempts].length; i++) {
        if (game.resultProposedCombinations[game.attempts][i] !== `b`) {
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
