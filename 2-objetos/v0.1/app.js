const { Console } = require("console-mpds");
const console = new Console();

playMastermind();

function playMastermind() {
  let continueDialog = initYesNoDialog(`¿Quieres jugar otra partida?`);
  do {
    // To do
    const game = initGame();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());
}

/*1.- Poner funciones privadas. -> Done
 *2.- Poner propiedades del objeto como privadas -> Done
 *3.- Modificar la función setValidProposedCombination(), para que almecene directamente el valor y no crear una variable local.
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
    TITLE: `\n\n----- MASTERMIND -----`,
    ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
    COMBINATIONS_LENGTH: 4,
    MAXIMUN_ATTEMPTS: 10,
    secretCombination: [],
    attempts: 0,
    isCorrectCombination: false,
    proposedCombinations: [],
    resultsOfComparingCombinations: [],
    WELL_POSITIONED: `b`,
    isRepeatedColor: function (color, secretCombination) {
      for (let i = 0; i < secretCombination.length; i++) {
        if (color === secretCombination[i]) {
          return true;
        }
      }
      return false;
    },
    isValidCombination: function (proposedCombination, { ALLOWED_COLORS, COMBINATIONS_LENGTH }) {
      const MSG_ERRORS = {
        LENGTH: `Wrong proposed combination length!!! (Correct length 4). Please try again.`,
        COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
        REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
      };
      if (proposedCombination.length !== COMBINATIONS_LENGTH) {
        console.writeln(MSG_ERRORS.LENGTH);
        return false;
      } else if (!game.areValidColors(proposedCombination, ALLOWED_COLORS)) {
        console.writeln(MSG_ERRORS.COLOR_NOT_VALID);
        return false;
      } else if (game.thereAreRepeatedColors(proposedCombination)) {
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
    play: function () {
      this.showTitle();
      this.setSecretCombinationWithoutRepeatedColors();
      console.writeln(`Secret Combination: ${game.secretCombination}`);
      do {
        this.showAttempts();
        this.setValidProposedCombination();
        this.compareProposedCombinationWithSecretCombination();
        this.showComparisonResult();
        this.verifyCorrectCombination();
        this.increaseAttemptsByOne();
      } while (!game.isCorrectCombination && game.attempts < game.MAXIMUN_ATTEMPTS);
      if (game.isCorrectCombination) {
        this.showWinningMessage();
      } else {
        this.showLosingMessage();
      }
    },
    showTitle: function () {
      console.writeln(game.TITLE);
    },
    setSecretCombinationWithoutRepeatedColors: function () {
      for (let i = 0; i < game.COMBINATIONS_LENGTH; i++) {
        let randomColor;
        do {
          randomColor = game.ALLOWED_COLORS[parseInt(Math.random() * game.ALLOWED_COLORS.length)];
        } while (game.isRepeatedColor(randomColor, game.secretCombination));
        game.secretCombination[i] = randomColor;
      }
    },
    showAttempts: function () {
      console.writeln(`\n${game.attempts + 1} attempt${game.attempts !== 0 ? `s` : ``}:\n****`);
    },
    setValidProposedCombination: function () {
      do {
        game.proposedCombinations[game.attempts] = console.readString(`Propose a combination: `);
      } while (!game.isValidCombination(game.proposedCombinations[game.attempts], game));
    },
    compareProposedCombinationWithSecretCombination: function () {
      const POORLY_POSITIONED = `w`;
      const EMPTY = `E`;
      const currentProposedCombination = game.proposedCombinations[game.attempts];
      let comparisonResult = ``;
      for (let i = 0; i < currentProposedCombination.length; i++) {
        if (game.isWellPositioned(currentProposedCombination[i], game.secretCombination[i])) {
          comparisonResult += game.WELL_POSITIONED;
        } else if (game.isPoorlyPositioned(game.secretCombination, currentProposedCombination[i])) {
          comparisonResult += POORLY_POSITIONED;
        } else {
          comparisonResult += EMPTY;
        }
      }
      game.resultsOfComparingCombinations[game.attempts] = comparisonResult;
    },
    showComparisonResult: function () {
      let msg = `\nResults:\n`;
      for (let i = 0; i < game.resultsOfComparingCombinations.length; i++) {
        msg += `${game.proposedCombinations[i]} --> ${game.resultsOfComparingCombinations[i]}\n`;
      }
      console.writeln(msg);
    },
    verifyCorrectCombination: function () {
      for (let i = 0; !game.isCorrectCombination && i < game.resultsOfComparingCombinations[game.attempts].length; i++) {
        if (game.resultsOfComparingCombinations[game.attempts][i] !== game.WELL_POSITIONED) {
          return game.isCorrectCombination;
        }
      }
      game.isCorrectCombination = true;
      return game.isCorrectCombination;
    },
    increaseAttemptsByOne: function () {
      game.attempts++;
    },
    showWinningMessage: function () {
      console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
    },
    showLosingMessage: function () {
      console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
    },
  };
}
