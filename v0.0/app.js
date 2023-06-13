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
let columnResult = [
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
let counterOfProposedCombination = 6;
let repeatedColor = false;

do {
  for (let i = 0; i < columnProposedCombinations[0].length; i++) {
    showBoard();
    // let optionOfColor = chooseOptionOfColor();
    // let optionOfPosition = setColorInPorposedCombination();
    placeColorInPosition(chooseOptionOfColor(), setColorInPorposedCombination());
    console.writeln(columnProposedCombinations);
  }
  counterOfProposedCombination--;
} while (true);

function placeColorInPosition(color, position) {
  if (columnProposedCombinations[counterOfProposedCombination][position] === `Na`) {
    for (let i = 0; i < columnProposedCombinations[counterOfProposedCombination].length; i++) {
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
  showSecreteCombination();
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
  const selectedOption = console.readString(msg);
  for (let i = 0; i < COLOR_OPTIONS.length; i++) {
    if (COLOR_OPTIONS[i][0] === selectedOption) {
      console.writeln(`Color Value: ${COLOR_OPTIONS[i][1]}`);
      return COLOR_OPTIONS[i][1];
    }
  }
}

function showSecreteCombination() {
  console.writeln(`Secrete combination: 1502`);
}
