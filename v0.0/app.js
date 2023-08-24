const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  playGame();

  function playGame() {
    let numberOfAttempts = 0;
    showGameTitle();
    showAttempts();
    const secreteCombination = getSecreteCombination();
    console.writeln(`Secret Combination: ${secreteCombination}`);

    function showGameTitle() {
      console.writeln("----- MASTERMIND -----");
    }

    function showAttempts() {
      console.writeln(`\n${numberOfAttempts} attempt(s):}\n****`);
    }

    function getSecreteCombination() {
      const COMPLETE_COMBINATION_NUMBER = 4;
      const ALLOWED_COLORS = ["RED", "GREEN", "BLUE", "YELLOW", "CYAN", "MAGENTA"];
      let secretCombination = [];
      let secretValue;
      for (let i = 0; i < COMPLETE_COMBINATION_NUMBER; i++) {
        secretValue = generateSecretValue();
        if (!isRepet(secretValue, secretCombination)) {
          secretCombination[i] = ALLOWED_COLORS[secretValue];
        } else {
          i--;
        }
      }
      return secretCombination;

      function generateSecretValue() {
        const MINIMUM_RANGE = 0;
        const MAXIMUM_RANGE = 6;
        return Math.floor(Math.random() * (MAXIMUM_RANGE - MINIMUM_RANGE)) + MINIMUM_RANGE;
      }

      function isRepet(secretValue, secretCombination) {
        if (secretCombination.length === 0) {
          return false;
        } else {
          for (let j = 0; j < secretCombination.length; j++) {
            if (ALLOWED_COLORS[secretValue] === secretCombination[j]) {
              return true;
            }
          }
          return false;
        }
      }
    }
  }
}
