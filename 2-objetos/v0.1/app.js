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

/*1.- Poner funciones privadas.
 *2.- Poner propiedades del objeto como privadas
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
  return {
    TITLE: `\n\n----- MASTERMIND -----`,
    ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
    COMBINATIONS_LENGTH: 4,
    MAXIMUN_ATTEMPTS: 2,
    secretCombination: [],
    attempts: 0,
    isCorrectCombination: false,
    proposedCombinations: [],
    resultsOfComparingCombinations: [],
    play: function () {
      this.showTitle();
      this.setSecretCombinationWithoutRepeatedColors();
      console.writeln(`Secret Combination: ${this.secretCombination}`);
      do {
        this.showAttempts();
        this.setValidProposedCombination();
        this.compareProposedCombinationWithSecretCombination();
        this.showComparisonResult();
        this.verifyCorrectCombination();
        this.increaseAttemptsByOne();
      } while (!this.isCorrectCombination && this.attempts < this.MAXIMUN_ATTEMPTS);
      if (this.isCorrectCombination) {
        this.showWinningMessage();
      } else {
        this.showLosingMessage();
      }
    },
    showTitle: function () {
      console.writeln(this.TITLE);
    },
    setSecretCombinationWithoutRepeatedColors: function () {
      for (let i = 0; i < this.COMBINATIONS_LENGTH; i++) {
        let randomColor;
        do {
          randomColor = this.ALLOWED_COLORS[parseInt(Math.random() * this.ALLOWED_COLORS.length)];
        } while (isRepeatedColor(randomColor, this.secretCombination));
        this.secretCombination[i] = randomColor;
      }
    },
    showAttempts: function () {
      console.writeln(`\n${this.attempts + 1} attempt${this.attempts !== 0 ? `s` : ``}:\n****`);
    },
    setValidProposedCombination: function () {
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination: `);
      } while (!isValidCombination(proposedCombination, this));
      this.proposedCombinations[this.attempts] = proposedCombination;
    },
    compareProposedCombinationWithSecretCombination: function () {
      const WELL_POSITIONED = `b`;
      const POORLY_POSITIONED = `w`;
      const EMPTY = `E`;
      const currentProposedCombination = this.proposedCombinations[this.attempts];
      let comparisonResult = ``;
      for (let i = 0; i < currentProposedCombination.length; i++) {
        if (isWellPositioned(currentProposedCombination[i], this.secretCombination[i])) {
          comparisonResult += WELL_POSITIONED;
        } else if (isPoorlyPositioned(this.secretCombination, currentProposedCombination[i])) {
          comparisonResult += POORLY_POSITIONED;
        } else {
          comparisonResult += EMPTY;
        }
      }
      this.resultsOfComparingCombinations[this.attempts] = comparisonResult;
    },
    showComparisonResult: function () {
      let msg = `\nResults:\n`;
      for (let i = 0; i < this.resultsOfComparingCombinations.length; i++) {
        msg += `${this.proposedCombinations[i]} --> ${this.resultsOfComparingCombinations[i]}\n`;
      }
      console.writeln(msg);
    },
    verifyCorrectCombination: function () {
      let isCorrect = true;
      const WELL_POSITIONED = `b`;
      for (let i = 0; isCorrect && i < this.resultsOfComparingCombinations[this.attempts].length; i++) {
        if (this.resultsOfComparingCombinations[this.attempts][i] !== WELL_POSITIONED) {
          isCorrect = false;
        }
      }
      this.isCorrectCombination = isCorrect;
    },
    increaseAttemptsByOne: function () {
      this.attempts++;
    },
    showWinningMessage: function () {
      console.writeln(`:) :) !!!!!!!!!!!! WELL DONE, YOU HAVE WON !!!!!!!!!!!`);
    },
    showLosingMessage: function () {
      console.writeln(`:( :( !!!!!!!!!!!! SORRY, YOU LOST !!!!!!!!!!!!`);
    },
  };

  function isRepeatedColor(color, secretCombination) {
    for (let i = 0; i < secretCombination.length; i++) {
      if (color === secretCombination[i]) {
        return true;
      }
    }
    return false;
  }

  function isValidCombination(proposedCombination, { ALLOWED_COLORS, COMBINATIONS_LENGTH }) {
    const MSG_ERRORS = {
      LENGTH: `Wrong proposed combination length!!! (Correct length 4). Please try again.`,
      COLOR_NOT_VALID: `Wrong colors, they must be "rgbycm". Please try again.`,
      REPEATED_COLORS: `Wrong, there are repeated colors. Please try again.`,
    };
    if (proposedCombination.length !== COMBINATIONS_LENGTH) {
      console.writeln(MSG_ERRORS.LENGTH);
      return false;
    } else if (!areValidColors(proposedCombination, ALLOWED_COLORS)) {
      console.writeln(MSG_ERRORS.COLOR_NOT_VALID);
      return false;
    } else if (thereAreRepeatedColors(proposedCombination)) {
      console.writeln(MSG_ERRORS.REPEATED_COLORS);
      return false;
    }
    return true;
  }

  function areValidColors(proposedCombination, allowedColors) {
    for (let proposedColor of proposedCombination) {
      if (!isAllowed(proposedColor, allowedColors)) {
        return false;
      }
    }
    return true;
  }

  function isAllowed(color, allowedColors) {
    let allowed = false;
    for (let i = 0; !allowed && i < allowedColors.length; i++) {
      if (color === allowedColors[i]) {
        allowed = true;
      }
    }
    return allowed;
  }

  function thereAreRepeatedColors(proposedCombination) {
    const NOT_FOUND = -1;
    let uniqueColors = [];
    for (let color of proposedCombination) {
      if (uniqueColors.indexOf(color) === NOT_FOUND) {
        uniqueColors[uniqueColors.length] = color;
      }
    }
    return uniqueColors.length !== proposedCombination.length;
  }

  function isWellPositioned(proposedColor, secretColor) {
    return proposedColor === secretColor;
  }

  function isPoorlyPositioned(secretCombination, colorToVerify) {
    let isEquals = false;
    for (let i = 0; !isEquals && i < secretCombination.length; i++) {
      if (colorToVerify === secretCombination[i]) {
        isEquals = true;
      }
    }
    return isEquals;
  }
}
