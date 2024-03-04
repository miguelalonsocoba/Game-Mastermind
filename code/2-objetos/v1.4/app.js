const { Console } = require("console-mpds");
const console = new Console();

initMastermindView().play();

function initMastermindView() {
  return {
    play: function () {
      const continueDialogView = initYesNoDialogView(`¿Quieres jugar otra partida? `);
      do {
        initGameView().play();
        continueDialogView.read();
      } while (continueDialogView.isAffirmative());
    },
  };
}

function initYesNoDialogView(question) {
  let answer = ``;
  return {
    read: function () {
      let error;
      do {
        answer = console.readString(question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Por favor, responda "si" o "no"`);
        }
      } while (error);
    },
    isAffirmative: function () {
      return answer === `si`;
    },
    isNegative: function () {
      return answer === `no`;
    },
  };
}

function initGameView() {
  const game = initGame();

  function show() {
    console.writeln(`${game.getAttempts()} attempt(s):\n****`);
    for (i = 0; i < game.getAttempts(); i++) {
      initProposalCombinationView().show(game.getProposalCombination(i));
      initResultView().show(game.getResult(i));
    }
  }

  return {
    play: function () {
      console.writeln(`----- MASTERMIND -----`);
      do {
        show();
        game.addProposalCombination(initProposalCombinationView().readProposalCombination());
      } while (!game.isEndGame());
      console.writeln(game.isWinner() ? "Has ganado!!! ;-)" : "Has perdido!!! :-(");
    },
  };
}

function initProposalCombinationView() {
  return {
    readProposalCombination: function () {
      let proposalCombination = initProposalCombination();
      do {
        const colors = console.readString(`Propon una combinacion:`);
        proposalCombination.setColors(colors);
        proposalCombination.valid();
        console.writeln(`HasError: ${proposalCombination.hasError()}`);
        console.writeln(`ErrorMessage: ${proposalCombination.getErrorMessage()}`);
        if (proposalCombination.hasError()) {
          console.writeln(`--------------------------------`);
          console.writeln(proposalCombination.getErrorMessage());
        }
      } while (proposalCombination.hasError());
      return proposalCombination;
    },
    show: function (proposalCombination) {
      console.write(proposalCombination.getColors());
    },
  };
}

function initResultView() {
  return {
    show(result) {
      console.writeln(` --> ${result.getBlacks()} blacks and ${result.getWhites()} whites`);
    },
  };
}

function initGame() {
  let proposalsCombinations = [];
  const secretCombination = initSecretCombination();
  return {
    addProposalCombination(proposalCombination) {
      proposalsCombinations.push(proposalCombination);
    },
    isEndGame() {
      return this.isWinner() || this.isLoser();
    },
    isWinner() {
      const lastProposalCombination = proposalsCombinations[proposalsCombinations.length - 1];
      return secretCombination.getResult(lastProposalCombination).isWinner();
    },
    isLoser() {
      const MAX_ATTEMPTS = 10;
      return proposalsCombinations.length === MAX_ATTEMPTS;
    },
    getAttempts() {
      return proposalsCombinations.length;
    },
    getResult(index) {
      return secretCombination.getResult(proposalsCombinations[index]);
    },
    getProposalCombination(index) {
      return proposalsCombinations[index];
    },
  };
}

function initSecretCombination() {
  const combination = initCombination();
  combination.fillWithRandomColors();
  return {
    getResult: function (proposalCombination) {
      const blacks = this.getBlacks(proposalCombination);
      const whites = this.getWhites(proposalCombination);
      return {
        isWinner() {
          return blacks === proposalCombination.length();
        },
        getBlacks() {
          return blacks;
        },
        getWhites() {
          return whites;
        },
      };
    },
    getBlacks: function (proposalCombination) {
      let blacks = 0;
      for (let i = 0; i < combination.length(); i++) {
        if (proposalCombination.contains(combination.getColor(i), i)) {
          blacks++;
        }
      }
      return blacks;
    },
    getWhites: function (proposalCombination) {
      let whites = 0;
      for (let i = 0; i < combination.length(); i++) {
        const color = combination.getColor(i);
        if (proposalCombination.contains(color) && !proposalCombination.contains(color, i)) {
          whites++;
        }
      }
      return whites;
    },
  };
}

function initProposalCombination() {
  const combination = initCombination();
  let error;
  let errorMessage;

  return {
    show: function () {
      combination.show();
    },
    getCombination: function () {
      return combination;
    },
    length: function () {
      return combination.length();
    },
    contains: function (color, index) {
      if (arguments.length == 2) {
        return combination.contains(color, index);
      }
      return combination.contains(color);
    },
    setColors: function (colors) {
      combination.setColors(colors);
    },
    getColors: function () {
      return combination.getColors();
    },
    valid: function () {
      console.writeln(`Valid: ${error}`);
      if (!combination.hasValidLength()) {
        error = !combination.hasValidLength();
        errorMessage = `- La longuitud de la combinación es incorrecta!`;
        console.writeln(`Error----------------------------------------: ${error}`);
      } else if (combination.hasRepeatedColors()) {
        error = combination.hasRepeatedColors();
        errorMessage = `- Combinación propuesta incorrecta, al menos, un color está repetido.`;
      } else if (!combination.hasValidColors()) {
        error = !combination.hasValidColors();
        errorMessage = `- Colores invalidos, los colores son ${combination.getAllowedColors()}`;
        console.writeln(`Error: ${combination.hasValidColors()}`);
      }
    },
    hasError: function () {
      return error;
    },
    getErrorMessage: function () {
      return errorMessage;
    },
  };
}

function initCombination() {
  const COMBINATION_LENGTH = 4;
  const ALLOWED_COLORS = "rgbycm";
  let colors = [];
  return {
    show: function () {
      console.write(colors);
    },
    length: function () {
      return colors.length;
    },
    contains: function (color, index) {
      if (arguments.length == 2) {
        return colors[index] === color;
      }
      for (let i = 0; i < colors.length; i++) {
        if (this.contains(color, i)) {
          return true;
        }
      }
      return false;
    },
    getColor: function (index) {
      return colors[index];
    },
    getColors: function () {
      return colors;
    },
    hasValidLength: function () {
      console.writeln(`In HasValidLength----------------------------`);
      return colors.length === COMBINATION_LENGTH;
    },
    hasValidColors: function () {
      this.setColors(ALLOWED_COLORS);
      let hasValidColors = true;
      for (let i = 0; i < colors.length; i++) {
        hasValidColors &= this.contains(colors[i]);
      }
      return hasValidColors;
    },
    hasRepeatedColors: function () {
      let hasRepeatedColors = false;
      for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length; j++) {
          if (colors[i] === colors[j] && i !== j) {
            hasRepeatedColors = true;
          }
        }
      }
      return hasRepeatedColors;
    },
    setColors: function (otherColors) {
      colors = otherColors;
    },
    fillWithRandomColors: function () {
      do {
        randomColor = ALLOWED_COLORS[parseInt(Math.random() * 6)];
        if (!this.contains(randomColor)) {
          colors[colors.length] = randomColor;
        }
      } while (!this.hasValidLength());
    },
    getAllowedColors: function () {
      return ALLOWED_COLORS;
    },
  };
}
