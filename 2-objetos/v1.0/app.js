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
    play: function () {},
  };

  function initBoard() {
    const that = {
      TITLE: `\n\n----- MASTERMIND -----`,
      ALLOWED_COLORS: ["r", "g", "b", "y", "c", "m"],
      COMBINATIONS_LENGTH: 4,
      MAXIMUN_ATTEMPTS: 10,
      attempts: 0,
      resultsOfComparingCombinations: [],
      proposedCombinations: [],
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
      showComparisonResult: function () {
        let msg = `\nResults:\n`;
        for (let i = 0; i < that.resultsOfComparingCombinations.length; i++) {
          msg += `${that.proposedCombinations[i]} --> ${that.resultsOfComparingCombinations[i]}\n`;
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

  function secretCombinationCreator() {
    const that = {
      secretCombination: [],
      WELL_POSUTUIBED: "b",
      POORLY_POSITIONED: "w",
      EMPTY: "e",
      correctCombination: false,
      isRepeatedColor: function (color, secretCombination) {},
      isWellPositioned: function (proposedColor, secretColor) {},
      isPoorlyPositioned: function (secretCombination, colorToVerify) {},
    };

    return {
      setCombinationWithoutRepeatedColors: function (board) {
        // Se definira..............................
      },
      getSecretCombination: function () {
        return secretCombination;
      },
      compare: function (combination) {},
      getResultsOfComparingCombination: function () {
        return resultsOfComparingCombinations;
      },
      verifyCorrectCombination: function () {},
      isCorrectCombination: function () {
        return correctCombination;
      },
    };
  }

  function decipher() {
    const that = {
      isValidCombination: function (proposedCombination, board) {},
      areValidColors: function (proposedCombination, board) {},
      isAllowed: function (color, board) {},
      thereAreRepeatedColors: function (proposedCombination) {},
    };

    return {
      proposeAValid: function (board) {},
      getProposedCombinations: function () {
        return proposedCombinations;
      },
    };
  }
}
