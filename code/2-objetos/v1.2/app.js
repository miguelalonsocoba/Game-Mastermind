const { Console } = require("console-mpds");
const console = new Console();

initMasterMind().play();

function initMasterMind() {
  return {
    play: function () {
      const continueDialog = initYesNoDialog(`Do you want to play again? `);
      do {
        initGame().play();
        continueDialog.read();
      } while (continueDialog.isAffirmative());
    },
  };
}

function initYesNoDialog(question) {
  const that = {
    answer: ``,
    isNegative: function () {
      return that.answer === `no`;
    },
  };
  return {
    read: function () {
      let error = false;
      do {
        that.answer = console.readString(question);
        error = !this.isAffirmative() && !that.isNegative();
        if (error) {
          console.writeln(`Please answer "yes" or "no"`);
        }
      } while (error);
    },
    isAffirmative: function () {
      return that.answer === `yes`;
    },
  };
}

function initGame() {
  const game = {
    ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
    COMBINATIONS_LENGTH: 4,
    TITLE: `\n\n----- MASTERMIND -----`,
    MAXIMUN_ATTEMPTS: 3,
    attempts: 0,
    showTitle: function () {
      console.writeln(game.TITLE);
    },
    showAttempts: function () {
      console.writeln(`\n${game.attempts + 1} attempt${game.attempts !== 0 ? `s` : ``}:\n****`);
    },
    increaseAttemptsByOne: function () {
      game.attempts++;
    },
    thereAreAttempts: function () {
      return game.attempts < game.MAXIMUN_ATTEMPTS;
    },
    result: initResult(),
    secretCombinationCreator: undefined,
    decipher: initDecipher(),
  };
  return {
    play: function () {
      game.secretCombinationCreator = initSecretCombinationCreator(game);
      game.showTitle();
      do {
        game.showAttempts();
        game.decipher.proposeAValidCombination(game);
        game.result.addResultsOfComparingCombinations(
          game.secretCombinationCreator.compare(game.decipher.getProposedCombinations()[game.attempts])
        );
        game.result.showComparisonResults(game.decipher.getProposedCombinations());
        game.result.verifyCorrectCombination();
        game.increaseAttemptsByOne();
      } while (!game.result.isCorrectCombination() && game.thereAreAttempts());
      if (game.result.isCorrectCombination()) {
        game.result.showWinningMessage();
      } else {
        game.result.showLosingMessage();
      }
    },
  };

  function initResult() {
    const that = {
      resultsOfComparingCombinations: [],
      isCorrectCombination: undefined,
      WELL_POSITIONED: `b`,
    };
    return {
      showWinningMessage: function () {
        console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
      },
      showLosingMessage: function () {
        console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
      },
      addResultsOfComparingCombinations: function (resultOfComparing) {
        that.resultsOfComparingCombinations[that.resultsOfComparingCombinations.length] = resultOfComparing;
      },
      showComparisonResults: function (proposedCombinations) {
        let msg = `\nResults:\n`;
        for (let i = 0; i < that.resultsOfComparingCombinations.length; i++) {
          msg += `${proposedCombinations[i]} --> ${that.resultsOfComparingCombinations[i]}\n`;
        }
        console.writeln(msg);
      },
      verifyCorrectCombination: function () {
        const currentResult = that.resultsOfComparingCombinations[that.resultsOfComparingCombinations.length - 1];
        that.isCorrectCombination = true;
        for (let i = 0; this.isCorrectCombination() && i < currentResult.length; i++) {
          if (currentResult[i] !== that.WELL_POSITIONED) {
            that.isCorrectCombination = false;
          }
        }
      },
      isCorrectCombination: function () {
        return that.isCorrectCombination;
      },
    };
  }

  function initSecretCombinationCreator(game) {
    const that = {
      secretCombination: ``,
      WELL_POSITIONED: `b`,
      POORLY_POSITIONED: `w`,
      EMPTY: `e`,
      isRepeatedColor: function (color, secretCombination) {
        for (let i = 0; i < secretCombination.length; i++) {
          if (color === secretCombination[i]) {
            return true;
          }
        }
        return false;
      },
      isWellPositioned: function (proposedColor, secretColor) {
        return proposedColor === secretColor;
      },
      isPoorlyPositioned: function (colorToVerify, secreteCombination) {
        for (let i = 0; i < secreteCombination.length; i++) {
          if (colorToVerify === secreteCombination[i]) {
            return true;
          }
        }
        return false;
      },
      setCombinationWithoutRepeatedColors: function ({ COMBINATIONS_LENGTH, ALLOWED_COLORS }) {
        for (let i = 0; i < COMBINATIONS_LENGTH; i++) {
          let randomColor;
          do {
            randomColor = ALLOWED_COLORS[parseInt(Math.random() * ALLOWED_COLORS.length)];
          } while (that.isRepeatedColor(randomColor, that.secretCombination));
          that.secretCombination += randomColor;
        }
      },
    };
    that.setCombinationWithoutRepeatedColors(game);
    console.writeln(`Secrete combination: ${that.secretCombination}`);
    return {
      compare: function (combination) {
        let comparisonResult = ``;
        for (let i = 0; i < combination.length; i++) {
          if (that.isWellPositioned(combination[i], that.secretCombination[i])) {
            comparisonResult += that.WELL_POSITIONED;
          } else if (that.isPoorlyPositioned(combination[i], that.secretCombination)) {
            comparisonResult += that.POORLY_POSITIONED;
          } else {
            comparisonResult += that.EMPTY;
          }
        }
        return comparisonResult;
      },
    };
  }

  function initDecipher() {
    const that = {
      proposedCombinations: [],
      isValidCombination: function (combination, { COMBINATIONS_LENGTH, ALLOWED_COLORS }) {
        const MSG_ERRORS = {
          LENGTH: `Wrong proposed combination length!!! (Correct length ${COMBINATIONS_LENGTH}). Please try again.`,
          COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
          REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
        };
        if (combination.length !== COMBINATIONS_LENGTH) {
          console.writeln(MSG_ERRORS.LENGTH);
          return false;
        } else if (!that.areValidColors(combination, ALLOWED_COLORS)) {
          console.writeln(MSG_ERRORS.COLOR_NOT_VALID);
          return false;
        } else if (that.thereAreRepeatedColors(combination)) {
          console.writeln(MSG_ERRORS.REPEATED_COLORS);
          return false;
        }
        return true;
      },
      areValidColors: function (combination, allowedColors) {
        for (let color of combination) {
          if (!that.isAllowed(color, allowedColors)) {
            return false;
          }
        }
        return true;
      },
      isAllowed: function (color, allowedColors) {
        let allowed = false;
        for (let i = 0; !allowed && i < allowedColors.length; i++) {
          if (color === allowedColors[i]) {
            allowed = true;
          }
        }
        return allowed;
      },
      thereAreRepeatedColors: function (combination) {
        const NO_FOUND = -1;
        let uniqueColors = [];
        for (let color of combination) {
          if (uniqueColors.indexOf(color) === NO_FOUND) {
            uniqueColors[uniqueColors.length] = color;
          }
        }
        return uniqueColors.length !== combination.length;
      },
      addProposedCombination: function (combination) {
        that.proposedCombinations[that.proposedCombinations.length] = combination;
      },
    };
    return {
      proposeAValidCombination: function (game) {
        let combination;
        do {
          combination = console.readString(`Propose a combination: `);
        } while (!that.isValidCombination(combination, game));
        that.addProposedCombination(combination);
      },
      getProposedCombinations: function () {
        return that.proposedCombinations;
      },
    };
  }
}
