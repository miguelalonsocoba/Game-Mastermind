const { Console } = require("console-mpds");
const console = new Console();

playMastermind();

function playMastermind() {
  let continueDialog = initYesNoDialog(`¿Quieres jugar otra partida?`);
  do {
    const game = initGame();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());
}

/*1.- Poner funciones privadas. -> Done
 *2.- Poner propiedades del objeto como privadas -> Done
 *3.- Modificar la función setValidProposedCombination(), para que almecene directamente el valor y no crear una variable local. -> Done
 *4.- Generar objetos de la clase ProposedCombination, Result, SecretCombination.
 */
function initYesNoDialog(question) {
  return {
    question: question,
    answer: ``,
    read: function () {
      let error = false;
      do {
        this.answer = console.readString(this.question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Por favor, responde "si" o "no"`);
        }
      } while (error);
    },
    isAffirmative: function () {
      return this.answer === `si`;
    },
    isNegative: function () {
      return this.answer === `no`;
    },
  };
}

function initGame() {
  const game = {
    ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
  };

  return {
    play: function () {
      const board = initBoard();
      const secretCombination = initSecretCombination();
      const proposedCombination = initProposedCombination();
      board.showTitle();
      secretCombination.setWithoutRepeatedColors(game.ALLOWED_COLORS, board.getCombinationsLength());
      console.writeln(`Secret combination: ${secretCombination.getSecretCombination()}`);
      do {
        board.showAttempts();
        proposedCombination.proposeAValid(board, game.ALLOWED_COLORS);
        secretCombination.compare(proposedCombination.getProposedCombinations(), board.getAttempts());
        board.showComparisonResult(
          proposedCombination.getProposedCombinations(),
          secretCombination.getResultsOfComparingCombinations()
        );
        secretCombination.verifyCorrectCombination(board.getAttempts());
        board.increaseAttemptsByOne();
      } while (!secretCombination.getIsCorrectCombination() && board.getAttempts() < board.getMaximunAttempts());
      if (secretCombination.getIsCorrectCombination()) {
        board.showWinningMessage();
      } else {
        board.showLosingMessage();
      }
    },
  };

  function initBoard() {
    const that = {
      TITLE: `\n\n----- MASTERMIND -----`,
      attempts: 0,
      COMBINATIONS_LENGTH: 4,
      MAXIMUN_ATTEMPTS: 10,
    };
    return {
      showTitle: function () {
        console.writeln(that.TITLE);
      },
      showAttempts: function () {
        console.writeln(`\n${that.attempts + 1} attempt${that.attempts !== 0 ? `s` : ``}:\n****`);
      },
      getAttempts: function () {
        return that.attempts;
      },
      getCombinationsLength: function () {
        return that.COMBINATIONS_LENGTH;
      },
      getMaximunAttempts: function () {
        return that.MAXIMUN_ATTEMPTS;
      },
      showComparisonResult: function (proposedCombinations, resultsOfComparingCombinations) {
        let msg = `\nResults:\n`;
        for (let i = 0; i < resultsOfComparingCombinations.length; i++) {
          msg += `${proposedCombinations[i]} --> ${resultsOfComparingCombinations[i]}\n`;
        }
        console.writeln(msg);
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
    };
  }

  function initSecretCombination() {
    const that = {
      secretCombination: [],
      WELL_POSITIONED: `b`,
      POORLY_POSITIONED: `w`,
      EMPTY: `E`,
      resultsOfComparingCombinations: [],
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
      isPoorlyPositioned: function (secretCombination, colorToVerify) {
        let isEquals = false;
        for (let i = 0; !isEquals && i < secretCombination.length; i++) {
          if (colorToVerify === secretCombination[i]) {
            isEquals = true;
          }
        }
        return isEquals;
      },
    };
    return {
      setWithoutRepeatedColors: function (allowedColors, combinationsLength) {
        for (let i = 0; i < combinationsLength; i++) {
          let randomColor;
          do {
            randomColor = allowedColors[parseInt(Math.random() * allowedColors.length)];
          } while (that.isRepeatedColor(randomColor, that.secretCombination));
          that.secretCombination[i] = randomColor;
        }
      },
      getSecretCombination: function () {
        return that.secretCombination;
      },
      compare: function (combination, attempts) {
        const currentProposedCombination = combination[attempts];
        let comparisonResult = ``;
        for (let i = 0; i < currentProposedCombination.length; i++) {
          if (that.isWellPositioned(currentProposedCombination[i], that.secretCombination[i])) {
            comparisonResult += that.WELL_POSITIONED;
          } else if (that.isPoorlyPositioned(that.secretCombination, currentProposedCombination[i])) {
            comparisonResult += that.POORLY_POSITIONED;
          } else {
            comparisonResult += that.EMPTY;
          }
        }
        that.resultsOfComparingCombinations[attempts] = comparisonResult;
      },
      getResultsOfComparingCombinations: function () {
        return that.resultsOfComparingCombinations;
      },
      verifyCorrectCombination: function (attempts) {
        for (let i = 0; !that.isCorrectCombination && i < that.resultsOfComparingCombinations[attempts].length; i++) {
          if (that.resultsOfComparingCombinations[attempts][i] !== that.WELL_POSITIONED) {
            return that.isCorrectCombination;
          }
        }
        that.isCorrectCombination = true;
        return that.isCorrectCombination;
      },
      getIsCorrectCombination: function () {
        return that.isCorrectCombination;
      },
    };
  }

  function initProposedCombination() {
    const that = {
      proposedCombinations: [],
      isValidCombination: function (proposedCombination, board, allowedColors) {
        const MSG_ERRORS = {
          LENGTH: `Wrong proposed combination length!!! (Correct length 4). Please try again.`,
          COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
          REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
        };
        if (proposedCombination.length !== board.getCombinationsLength()) {
          console.writeln(MSG_ERRORS.LENGTH);
          return false;
        } else if (!this.areValidColors(proposedCombination, allowedColors)) {
          console.writeln(MSG_ERRORS.COLOR_NOT_VALID);
          return false;
        } else if (this.thereAreRepeatedColors(proposedCombination)) {
          console.writeln(MSG_ERRORS.REPEATED_COLORS);
          return false;
        }
        return true;
      },
      areValidColors: function (proposedCombination, allowedColors) {
        for (let proposedColor of proposedCombination) {
          if (!this.isAllowed(proposedColor, allowedColors)) {
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
        const NOT_FOUND = -1;
        let uniqueColors = [];
        for (let color of proposedCombination) {
          if (uniqueColors.indexOf(color) === NOT_FOUND) {
            uniqueColors[uniqueColors.length] = color;
          }
        }
        return uniqueColors.length !== proposedCombination.length;
      },
    };
    return {
      proposeAValid: function (board, allowedColors) {
        do {
          that.proposedCombinations[board.getAttempts()] = console.readString(`Propose a combination: `);
        } while (!that.isValidCombination(that.proposedCombinations[board.getAttempts()], board, allowedColors));
      },
      getProposedCombinations: function () {
        return that.proposedCombinations;
      },
    };
  }
}
