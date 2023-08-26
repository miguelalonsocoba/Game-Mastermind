const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  playGame();

  function playGame() {
    let numberOfAttempts = 0;
    showGameTitle();
    showAttempts();
    const ALLOWED_COLORS = ["r", "g", "b", "y", "c", "m"];
    const secreteCombination = getSecreteCombination();
    console.writeln(`Secret Combination: ${secreteCombination}`);
    let proposedCombination = proposeCombination();
    // console.writeln(proposedCombination); // Error
    // if (proposedCombination.length === 2) {
    //   console.writeln(proposedCombination[1]);
    // }

    function showGameTitle() {
      console.writeln("----- MASTERMIND -----");
    }

    function showAttempts() {
      console.writeln(`\n${numberOfAttempts} attempt(s):}\n****`);
    }

    function getSecreteCombination() {
      const COMPLETE_COMBINATION_NUMBER = 4;
      let secretCombination = [];
      let secretColor;
      for (let i = 0; i < COMPLETE_COMBINATION_NUMBER; i++) {
        secretColor = generateSecretColor();
        if (!repeatedColor(secretColor, secretCombination)) {
          secretCombination[i] = ALLOWED_COLORS[secretColor];
        } else {
          i--;
        }
      }
      return secretCombination;

      function generateSecretColor() {
        const MINIMUM_RANGE = 0;
        const MAXIMUM_RANGE = 6;
        return Math.floor(Math.random() * (MAXIMUM_RANGE - MINIMUM_RANGE)) + MINIMUM_RANGE;
      }

      function repeatedColor(secretColor, secretCombination) {
        if (secretCombination.length === 0) {
          return false;
        } else {
          let itIsRepeated = false;
          for (let j = 0; !itIsRepeated && j < secretCombination.length; j++) {
            if (ALLOWED_COLORS[secretColor] === secretCombination[j]) {
              itIsRepeated = true;
            }
          }
          return itIsRepeated;
        }
      }
    }

    function proposeCombination() {
      const proposedCombination = console.readString(`Propose a combination:`);
      let isValidcombination = validateCombination(proposedCombination);
      console.writeln(`Validate combination: ${isValidcombination.length}`);

      function validateCombination(proposedCombination) {
        let response = [`true`];
        if (!validateLength(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong proposed combination length!!!`;
          console.writeln(`Response: ${response.length}`);
          return response;
        }
        if (!validateColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong colors, they must be : rgbycm`;
          console.writeln(`Response: ${response.length}`);
          return response;
        }
        console.writeln(`Response: ${response.length}`);
        return response;

        function validateLength(proposedCombination) {
          return proposedCombination.length === 4;
        }

        function validateColors(proposedCombination) {
          for (let i = 0; i < proposedCombination.length; i++) {
              let colorIsValid = false;
            for (let j = 0; !colorIsValid && j < ALLOWED_COLORS.length; j++) {
              if (proposedCombination[i] === ALLOWED_COLORS[j]) {
                colorIsValid = true;
              }
            }
            if (!colorIsValid) {
              return colorIsValid;
            }
          }
          return true;
        }
      }
    }
  }
}
