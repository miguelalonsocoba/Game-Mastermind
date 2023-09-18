const { Console } = require(`console-mpds`);
const console = new Console();

playMastermind();

function playMastermind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    let numberOfAttempts = 1;
    const ALLOWED_ATTEMPTS = 10;
    showGameTitle();
    const ALLOWED_COLORS = ["r", "g", "b", "y", "c", "m"];
    const secretCombination = getSecreteCombination();
    console.writeln(`Secret Combination: ${secretCombination}`);
    let correctCombination;
    do {
      showAttempts();
      const proposedCombination = proposeCombination();
      const resultProposedCombination = compareCombinations(secretCombination, proposedCombination);
      correctCombination = proposedCombinationIsCorrect(resultProposedCombination);
      showResult(proposedCombination, resultProposedCombination);
      increaseByOneAttempts();
      if (correctCombination) {
        showWinningMessage();
      }
    } while (!correctCombination && numberOfAttempts <= ALLOWED_ATTEMPTS);
    if (numberOfAttempts > ALLOWED_ATTEMPTS) {
      showLosingMessage();
    }

    function showGameTitle() {
      console.writeln("----- MASTERMIND -----");
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

    function showAttempts() {
      console.writeln(`\n${numberOfAttempts} attempt(s):\n****`);
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
      return proposedCombination;

      function validateCombination(proposedCombination) {
        let response = [`true`];
        if (!validateLength(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong proposed combination length!!! (Correct length 4). Please try again`;
          return response;
        }
        if (!validateColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong colors, they must be : rgbycm. Please try again`;
          return response;
        }
        if (thereAreRepeatedColors(proposedCombination)) {
          response[0] = `false`;
          response[1] = `Wrong, there are repeated colors. Please try again`;
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

        function thereAreRepeatedColors(combination) {
          for (let i = 0; i < combination.length - 1; i++) {
            for (let j = i + 1; j < combination.length; j++) {
              if (combination[i] === combination[j]) {
                return true;
              }
            }
          }
          return false;
        }
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
        if (combination[i] === `Na` || combination[i] === `w`) {
          return false;
        }
      }
      return true;
    }

    function increaseByOneAttempts() {
      numberOfAttempts++;
    }

    function showResult(proposedCombination, resultProposedCombination) {
      console.writeln(`${proposedCombination} --> ${resultProposedCombination}`);
    }

    function showWinningMessage() {
      const WINNING_MESSAGE = `Well done, you have won.`;
      console.writeln(WINNING_MESSAGE);
    }

    function showLosingMessage() {
      const LOST_MESSAGE = `Sorry, you lost`;
      console.writeln(LOST_MESSAGE);
    }
  }

  function isResumed() {
    let resutl;
    let answer;
    let error = false;
    do {
      answer = console.readString(`Do you want play again?`);
      resutl = answer === `yes`;
      error = !resutl && answer !== `not`;
      if (error) {
        console.writeln(`Please, respond "yes" or "not"`);
      }
    } while (error);
    return resutl;
  }
}
