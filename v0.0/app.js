const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  playGame();

  function playGame() {
    let numberOfAttempts = 0;
    showGameTitle();
    const ALLOWED_COLORS = ["r", "g", "b", "y", "c", "m"];
    const secretCombination = getSecreteCombination();
    console.writeln(`Secret Combination: ${secretCombination}`);
    let correctCombination = false;
    do {
      showAttempts();
      let proposedCombination = proposeCombination();
      console.writeln(`Proposed combination ${proposedCombination}`);

      let resultProposedCombination = compareCombinations(secretCombination, proposedCombination);
      console.writeln(`Result proposed combination: ${resultProposedCombination}`);

      correctCombination = proposedCombinationIsCorrect(resultProposedCombination);
      console.writeln(`Correct combination: ${correctCombination}`);
      increaseByOneAttempts();
    } while (correctCombination === false && numberOfAttempts <= 10);

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
      let isValidcombination;
      let proposedCombination;
      do {
        proposedCombination = console.readString(`Propose a combination:`);
        isValidcombination = validateCombination(proposedCombination);
        if (isValidcombination[0] === `false`) {
          console.writeln(isValidcombination[1]);
        }
      } while (isValidcombination[0] === `false`);
      // increaseAttempts();
      return proposedCombination;

      function validateCombination(proposedCombination) {
        let response = [`true`];
        if (!validateLength(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong proposed combination length!!!`;
          return response;
        }
        if (!validateColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong colors, they must be : rgbycm`;
          return response;
        }
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

      function increaseAttempts() {
        numberOfAttempts++;
      }
    }

    function compareCombinations(secretCombination, proposedCombination) {
      const WELL_POSITIONED = `b`;
      const POORLY_POSITIONED = `w`;
      let resultProposedCombination = [];
      for (let i = 0; i < proposedCombination.length; i++) {
        let isEquals = false;
        if (proposedCombination[i] === secretCombination[i]) {
          isEquals = true;
          resultProposedCombination[i] = WELL_POSITIONED;
        }
        for (let j = 0; !isEquals && j < secretCombination.length; j++) {
          if (proposedCombination[i] === secretCombination[j]) {
            isEquals = true;
            resultProposedCombination[i] = POORLY_POSITIONED;
          }
        }
        if (resultProposedCombination[i] === undefined) {
          resultProposedCombination[i] = `Na`;
        }
      }
      return resultProposedCombination;
    }

    function proposedCombinationIsCorrect(combination) {
      for (let i = 0; i < combination.length; i++) {
        if (combination[i] === `Na`) {
          return false;
        }
      }
      return true;
    }

    function increaseByOneAttempts() {
      numberOfAttempts++;
    }
  }
}
