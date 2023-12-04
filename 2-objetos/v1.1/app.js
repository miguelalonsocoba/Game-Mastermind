const { Console } = require("console-mpds");
const console = new Console();

initMasterMind().play();

function initMasterMind() {
  return {
    play: function () {
      const continueDialog = initYesNoDialog(`Do you want to play again?`);
      do {
        const game = initGame();
        game.play();
        continueDialog.read();
      } while (continueDialog.isAffirmative());
    },
  };
}

function initYesNoDialog(question) {
  const that = {
    question: question,
    answer: ``,
    isNegative: function () {
      return that.answer === `no`;
    },
  };
  return {
    read: function () {
      let error = false;
      do {
        that.answer = console.readString(that.question);
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
  };
  const result = initResult();
  const secretCombinationCreator = initSecretCombinationCreator(game.COMBINATIONS_LENGTH, game.ALLOWED_COLORS);
  const decipher = initDecipher();
  return {
    play: function () {
      game.showTitle();
      console.writeln(secretCombinationCreator.getSecretCombination());
      do {
        game.showAttempts();
        decipher.proposeAValidCombination(game);
        result.addResultsOfComparingCombinations(
          secretCombinationCreator.compare(decipher.getProposedCombinationCurrently(game.attempts))
        );
        result.showComparisonResult(decipher.getProposedCombinations());
        secretCombinationCreator.verifyCorrectCombination(result.getResultsOfComparingCombinationsCurrently(game.attempts));
        game.increaseAttemptsByOne();
      } while (!secretCombinationCreator.isCorrectCombination() && game.attempts < game.MAXIMUN_ATTEMPTS);
      if (secretCombinationCreator.isCorrectCombination()) {
        result.showWinningMessage();
      } else {
        result.showLosingMessage();
      }
    },
  };

  function initResult() {
    const that = {
      resultsOfComparingCombinations: [],
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
      showComparisonResult: function (proposedCombinations) {
        let msg = `\nResults:\n`;
        for (let i = 0; i < that.resultsOfComparingCombinations.length; i++) {
          msg += `${proposedCombinations[i]} --> ${that.resultsOfComparingCombinations[i]}\n`;
        }
        console.writeln(msg);
      },
      getResultsOfComparingCombinationsCurrently: function (currently) {
        return that.resultsOfComparingCombinations[currently];
      },
    };
  }

  function initSecretCombinationCreator(combinationsLength, allowedColors) {
    const that = {
      secretCombination: ``,
      WELL_POSITIONED: `b`,
      POORLY_POSITIONED: `w`,
      EMPTY: `e`,
      isCorrectCombination: false,
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
      addToSecretCombination: function (color) {
        that.secretCombination += color;
      },
      setIsCorrectCombination: function (value) {
        that.isCorrectCombination = value;
      },
      setCombinationWithoutRepeatedColors: function (combinationsLength, allowedColors) {
        for (let i = 0; i < combinationsLength; i++) {
          let randomColor;
          do {
            randomColor = allowedColors[parseInt(Math.random() * allowedColors.length)];
          } while (that.isRepeatedColor(randomColor, that.secretCombination));
          that.addToSecretCombination(randomColor);
        }
      },
    };
    that.setCombinationWithoutRepeatedColors(combinationsLength, allowedColors);
    return {
      getSecretCombination: function () {
        return that.secretCombination;
      },
      compare: function (combination) {
        let comparisonResult = ``;
        for (let i = 0; i < combination.length; i++) {
          if (that.isWellPositioned(combination[i], this.getSecretCombination()[i])) {
            comparisonResult += that.WELL_POSITIONED;
          } else if (that.isPoorlyPositioned(combination[i], this.getSecretCombination())) {
            comparisonResult += that.POORLY_POSITIONED;
          } else {
            comparisonResult += that.EMPTY;
          }
        }
        return comparisonResult;
      },
      verifyCorrectCombination: function (resultOfComparingCombination) {
        for (let i = 0; !this.isCorrectCombination() && i < resultOfComparingCombination.length; i++) {
          if (resultOfComparingCombination[i] !== that.WELL_POSITIONED) {
            return this.isCorrectCombination();
          }
        }
        that.setIsCorrectCombination(true);
        return that.isCorrectCombination;
      },
      isCorrectCombination: function () {
        return that.isCorrectCombination;
      },
    };
  }

  function initDecipher() {
    const that = {
      proposedCombinations: [],
      isValidCombination: function (combination, game) {
        const MSG_ERRORS = {
          LENGTH: `Wrong proposed combination length!!! (Correct length ${game.COMBINATIONS_LENGTH}). Please try again.`,
          COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
          REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
        };
        if (combination.length !== game.COMBINATIONS_LENGTH) {
          console.writeln(MSG_ERRORS.LENGTH);
          return false;
        } else if (!that.areValidColors(combination, game.ALLOWED_COLORS)) {
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
      getProposedCombinationCurrently: function (currently) {
        return that.proposedCombinations[currently];
      },
    };
  }
}
