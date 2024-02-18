const { Console } = require("console-mpds");
const console = new Console();

initMasterMind().play();

function initMasterMind() {
  return {
    play() {
      const continueDialog = initYesNoDialog(`Do you want to play again? `);
      do {
        initGame().play();
        continueDialog.read();
      } while (continueDialog.isAffirmative());
    },
  };
}

function initYesNoDialog(question) {
  let answer = ``;
  return {
    read() {
      let error = false;
      do {
        answer = console.readString(question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Please answer "yes" or "no"`);
        }
      } while (error);
    },
    isAffirmative() {
      return answer === `yes`;
    },
    isNegative() {
      return answer === `no`;
    },
  };
}

function initGame() {
  let proposalsCombination = [];
  const secretCombination = initSecretCombination();
  return {
    play() {
      console.writeln(`\n\n----- MASTERMIND -----`);
      do {
        this.show();
        proposalsCombination.push(initProposalCombination().read());
      } while (!this.isEndGame());
      console.writeln(this.isWinner() ? `You have won!!! ;-)` : `You have lost!!! :-(`);
    },
    show() {
      console.writeln(`${proposalsCombination.length} intento(s):\n*****`);
      for (const proposalCombination of proposalsCombination) {
        proposalCombination.show();
        secretCombination.getResult(proposalCombination).show();
      }
    },
    isEndGame() {
      return this.isWinner() || this.isLooser();
    },
    isWinner() {
      const lastProposalCombination = proposalsCombination[proposalsCombination.length - 1];
      return secretCombination.getResult(lastProposalCombination).isWinner();
    },
    isLooser() {
      const MAX_ATTEMPTS = 10;
      return proposalsCombination.length === MAX_ATTEMPTS;
    },
  };
}

function initSecretCombination() {
  const combination = initCombination();
  combination.fillWithRandomColors();
  return {
    getResult(proposalCombination) {
      const blacks = this.getBlacks(proposalCombination);
      const whites = this.getWhites(proposalCombination);
      return {
        isWinner() {
          return blacks === proposalCombination.length();
        },
        show() {
          console.writeln(` ---> ${blacks} blacks and ${whites} whites`);
        },
      };
    },
    getBlacks(proposalCombination) {
      let blacks = 0;
      for (let i = 0; i < combination.length(); i++) {
        if (proposalCombination.contains(combination.getColor(i), i)) {
          blacks++;
        }
      }
      return blacks;
    },
    getWhites(proposalCombination) {
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
  return {
    show() {
      combination.show();
    },
    getCombination() {
      return combination;
    },
    read() {
      combination.read();
      return this;
    },
    length() {
      return combination.length();
    },
    contains(color, index) {
      if (arguments.length === 2) {
        return combination.contains(color, index);
      }
      return combination.contains(color);
    },
  };
}

function initCombination() {
  const COMBINATION_LENGTH = 4;
  const COLORS = "rgbycm";
  let colors = [];

  return {
    show() {
      console.write(colors);
    },
    length() {
      return colors.length;
    },
    contains(color, index) {
      if (arguments.length === 2) {
        return colors[index] === color;
      }
      for (let i = 0; i < colors.length; i++) {
        if (this.contains(color, i)) {
          return true;
        }
      }
      return false;
    },
    getColor(index) {
      return colors[index];
    },
    hasValidLength() {
      return colors.length === COMBINATION_LENGTH;
    },
    hasValidColors() {
      const gameColors = initCombination();
      gameColors.setColors(COLORS);
      let hasValidColors = true;
      for (let i = 0; i < colors.length; i++) {
        hasValidColors &= gameColors.contains(colors[i]);
      }
      return hasValidColors;
    },
    hasRepeatedColors() {
      let hasRepeatedColors = false;
      for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length; j++) {
          if (colors[i] === colors[j] && i != j) {
            hasRepeatedColors = true;
          }
        }
      }
      return hasRepeatedColors;
    },
    setColors(otherColors) {
      colors = otherColors;
    },
    fillWithRandomColors() {
      do {
        const randomColor = COLORS[parseInt(Math.random() * 6)];
        if (!this.contains(randomColor)) {
          colors[colors.length] = randomColor;
        }
      } while (!this.hasValidLength());
      console.writeln(`Secrete combination: ${colors}`);
    },
    read() {
      let error;
      do {
        const response = console.readString(`Propose a combination: `);
        this.setColors(response);
        if (!this.hasValidLength()) {
          console.writeln(`- The length ot the combination is incorrect!.`);
        } else if (this.hasRepeatedColors()) {
          console.writeln(`- Incorrect proposed combination, at least, one color is repeated!.`);
        } else if (!this.hasValidColors()) {
          console.writeln(`- Invalid colors, colors are: ${COLORS}`);
        }
        error = !this.hasValidLength() || !this.hasValidColors() || this.hasRepeatedColors();
      } while (error);
    },
  };
}
