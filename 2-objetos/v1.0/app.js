const { Console } = require("console-mpds");
const console = new Console();

playMasterMind();

function playMasterMind() {
  const continueDialog = initYesNoDialog(`¿Quieres jugar otra partida?`);
  do {
    const game = initGame();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());
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
          console.writeln(`Por favor responde "si" o "no".`);
        }
      } while (error);
    },
    isAffirmative: function () {
      return that.answer === `si`;
    },
  };
}

function initGame() {
  return {
    play: function () {
      const board = initBoard(); //La funcionalidad del Board solo es almacenar la combinación secreta, las combinaciones propuestas y los resultados de comparar ambas combinaciones.
      const secretCombinaCreator = initSecretCombinationCreator(board.getCombinationLength(), board.getAllowedColors());
      const decipher = initDecipher();

      board.showTitle();
      console.writeln(secretCombinaCreator.getSecretCombination());
      do {
        board.showAttempts();
        decipher.proposeAValidCombination(board); //La combinación propuesta se debera agregar al Board.
        secretCombinaCreator.compare(decipher.getProposedCombinations()[board.getAttempts()]);
        secretCombinaCreator.showComparisonResult(decipher.getProposedCombinations());
        secretCombinaCreator.verifyCorrectCombination();
        board.increaseAttemptsByOne();
      } while (!secretCombinaCreator.isCorrectCombination() && board.getAttempts() < board.getMaximunAttempts());
      if (secretCombinaCreator.isCorrectCombination()) {
        board.showWinningMessage();
      } else {
        board.showLosingMessage();
      }
    },
  };

  function initBoard() {
    const that = {
      TITLE: `\n\n----- MASTERMIND -----`,
      ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
      COMBINATIONS_LENGTH: 4,
      MAXIMUN_ATTEMPTS: 10,
      attempts: 0,
    };

    return {
      showTitle: function () {
        console.writeln(that.TITLE);
      },
      showAttempts: function () {
        console.writeln(`\n${this.getAttempts() + 1} attempt${this.getAttempts() !== 0 ? `s` : ``}:\n****`);
      },
      getAttempts: function () {
        return that.attempts;
      },
      getCombinationLength: function () {
        return that.COMBINATIONS_LENGTH;
      },
      getMaximunAttempts: function () {
        return that.MAXIMUN_ATTEMPTS;
      },
      increaseAttemptsByOne: function () {
        that.attempts++;
      },
      showWinningMessage: function () {
        console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
      },
      showLosingMessage: function () {
        console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
      },
      getAllowedColors: function () {
        return that.ALLOWED_COLORS;
      },
    };
  }

  function initSecretCombinationCreator(combinationsLength, allowedColors) {
    const that = {
      secretCombination: ``,
      WELL_POSITIONED: "b",
      POORLY_POSITIONED: "w",
      EMPTY: "e",
      isCorrectCombination: false,
      resultsOfComparingCombinations: [],
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
      isPoorlyPositioned: function (colorToVerify, secretCombination) {
        for (let i = 0; i < secretCombination.length; i++) {
          if (colorToVerify === secretCombination[i]) {
            return true;
          }
        }
        return false;
      },
      addToSecretCombination: function (color) {
        that.secretCombination += color;
      },
      getWellPositioned: function () {
        return that.WELL_POSITIONED;
      },
      getPoorlyPositioned: function () {
        return that.POORLY_POSITIONED;
      },
      getEmpty: function () {
        return that.EMPTY;
      },
      addResultsOfComparingCombinations: function (comparisonResult) {
        that.resultsOfComparingCombinations[that.resultsOfComparingCombinations.length] = comparisonResult;
      },
      setIsCorrectCombination: function (value) {
        that.isCorrectCombination = value;
      },
      setCombinationWithoutRepeatedColors: function (combinationsLength, allowedColors) {
        for (let i = 0; i < combinationsLength; i++) {
          let randomColor;
          do {
            randomColor = allowedColors[parseInt(Math.random() * allowedColors.length)];
          } while (this.isRepeatedColor(randomColor, this.secretCombination));
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
            comparisonResult += that.getWellPositioned();
          } else if (that.isPoorlyPositioned(combination[i], this.getSecretCombination())) {
            comparisonResult += that.getPoorlyPositioned();
          } else {
            comparisonResult += that.getEmpty();
          }
        }
        that.addResultsOfComparingCombinations(comparisonResult);
      },
      showComparisonResult: function (proposedCombinations) {
        let msg = `\nResults:\n`;
        for (let i = 0; i < that.resultsOfComparingCombinations.length; i++) {
          msg += `${proposedCombinations[i]} --> ${that.resultsOfComparingCombinations[i]}\n`;
        }
        console.writeln(msg);
      },
      getResultsOfComparingCombination: function () {
        return that.resultsOfComparingCombinations;
      },
      verifyCorrectCombination: function () {
        for (
          let i = 0;
          !this.isCorrectCombination() &&
          i < this.getResultsOfComparingCombination()[this.getResultsOfComparingCombination().length - 1].length;
          i++
        ) {
          if (
            this.getResultsOfComparingCombination()[this.getResultsOfComparingCombination().length - 1][i] !==
            that.getWellPositioned()
          ) {
            return this.isCorrectCombination();
          }
        }
        that.setIsCorrectCombination(true);
        return this.isCorrectCombination();
      },
      isCorrectCombination: function () {
        return that.isCorrectCombination;
      },
    };
  }

  function initDecipher() {
    const that = {
      proposedCombinations: [],
      isValidCombination: function (proposedCombination, board) {
        const MSG_ERRORS = {
          LENGTH: `Wrong proposed combination length!!! (Correct length 4). Please try again.`,
          COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
          REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
        };
        if (proposedCombination.length !== board.getCombinationLength()) {
          console.writeln(MSG_ERRORS.LENGTH);
          return false;
        } else if (!that.areValidColors(proposedCombination, board.getAllowedColors())) {
          console.writeln(MSG_ERRORS.COLOR_NOT_VALID);
          return false;
        } else if (that.thereAreRepeatedColors(proposedCombination)) {
          console.writeln(MSG_ERRORS.REPEATED_COLORS);
          return false;
        }
        return true;
      },
      areValidColors: function (proposedCombination, allowedColors) {
        for (let proposedColor of proposedCombination) {
          if (!that.isAllowed(proposedColor, allowedColors)) {
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
      thereAreRepeatedColors: function (proposedCombination) {
        const NO_FOUND = -1;
        let uniqueColors = [];
        for (let color of proposedCombination) {
          if (uniqueColors.indexOf(color) === NO_FOUND) {
            uniqueColors[uniqueColors.length] = color;
          }
        }
        return uniqueColors.length !== proposedCombination.length;
      },
      addProposedCombination: function (combination) {
        that.proposedCombinations[that.proposedCombinations.length] = combination;
      },
    };

    return {
      proposeAValidCombination: function (board) {
        let combination;
        do {
          combination = console.readString(`Propose a combination: `);
        } while (!that.isValidCombination(combination, board));
        that.addProposedCombination(combination);
      },
      getProposedCombinations: function () {
        return that.proposedCombinations;
      },
    };
  }
}
