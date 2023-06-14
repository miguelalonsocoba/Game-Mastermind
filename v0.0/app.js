const { Console } = require(`console-mpds`);
const console = new Console();

let columnProposedCombinations = [
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
];
const COLOR_OPTIONS = [
  [`0`, `RED`],
  [`1`, `GREEN`],
  [`2`, `BLUE`],
  [`3`, `YELLOW`],
  [`4`, `CYAN`],
  [`5`, `MAGENTA`],
];
let columnResult = [
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
  [`Na`, `Na`, `Na`, `Na`],
];
let counterOfProposedCombination = 6;

generateSecreteCombination();

// do {
//   for (let i = 0; i < columnProposedCombinations[0].length; i++) {
//     showBoard();
//     placeColorInPosition(chooseOptionOfColor(), setColorInPorposedCombination());
//     console.writeln(columnProposedCombinations);
//   }
//   checkColorPositions(columnProposedCombinations);
//   counterOfProposedCombination--;
// } while (true);

function checkColorPositions(columnProposedCombinations) {}

function placeColorInPosition(color, position) {
  let repeatedColor = false;
  if (columnProposedCombinations[counterOfProposedCombination][position] === `Na`) {
    for (let i = 0; i <= columnProposedCombinations[counterOfProposedCombination].length; i++) {
      if (columnProposedCombinations[counterOfProposedCombination][i] === color) {
        repeatedColor = true;
      }
      if (!repeatedColor) {
        columnProposedCombinations[counterOfProposedCombination][position] = color;
      }
    }
  }
}

function setColorInPorposedCombination() {
  let position = console.readNumber(`Select the position to place the chosen color:`);
  return position;
}

function showBoard() {
  showMainPanel(columnResult, columnProposedCombinations);
  showSecreteCombination(generateSecretCombination());
}

function generateSecreteCombination() {
  const MAX = 6;
  const MIN = 0;
  const FULL = 4;
  let combinationSecrete = [];
  for (let i = 0; i !== FULL; i++) {
    console.writeln(`Length: ${combinationSecrete.length}`);
    combinationSecrete[i] = Math.floor(Math.random() * (MAX - MIN)) + MIN;
  }
}

function showMainPanel(columnResult, columnProposedCombinations) {
  console.write(`Proposed\nCombinations: `);
  console.writeln(` Results:`);
  for (let i = 0; i < columnProposedCombinations.length; i++) {
    console.write(`${columnProposedCombinations[i]}  |  `);
    console.writeln(`${columnResult[i]}`);
  }
}

function chooseOptionOfColor() {
  let msg = `Select the color number:\n`;
  for (let i = 0; i < COLOR_OPTIONS.length; i++) {
    msg += `${COLOR_OPTIONS[i][0]} -> ${COLOR_OPTIONS[i][1]}\n`;
  }
  let selectedOption = console.readString(msg);
  let optionCorrect;
  do {
    optionCorrect = true;
    if (
      selectedOption !== `0` &&
      selectedOption !== `1` &&
      selectedOption !== `2` &&
      selectedOption !== `3` &&
      selectedOption !== `4` &&
      selectedOption !== `5`
    ) {
      optionCorrect = false;
      console.writeln(`Invalid option!!! Try again...`);
      selectedOption = console.readString(msg);
    }
  } while (!optionCorrect);
  for (let i = 0; i < COLOR_OPTIONS.length; i++) {
    if (COLOR_OPTIONS[i][0] === selectedOption) {
      return COLOR_OPTIONS[i][1];
    }
  }
}

function showSecreteCombination(secreteCombination) {
  console.writeln(`Secrete combination: ${secreteCombination}`);
}
