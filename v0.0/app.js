const { Console } = require(`console-mpds`);
const console = new Console();

let columnProposedCombinations = [
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
];
const COLOR_OPTIONS = [
  [`0`, `R`],
  [`1`, `G`],
  [`2`, `B`],
  [`3`, `Y`],
  [`4`, `C`],
  [`5`, `M`],
];
let columnResult = [
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
  [`N`, `N`, `N`, `N`],
];
let counterOfProposedCombination = 6;
let correctCombination = false;

const combinationSecrete = generateSecreteCombination();
do {
  const NUMBER_OF_PROPOSED_COLORS = 4;
  for (let i = 0; i < NUMBER_OF_PROPOSED_COLORS; i++) {
    console.writeln(`Value i: ${i}`);
    showBoard(combinationSecrete);
    let repeatedColor = placeColorInPosition(chooseOptionOfColor(), setColorInPorposedCombination());
    console.griteln(`repetedColor: ${repeatedColor}`);
    if (repeatedColor) {
      i--;
    }
  }
  checkColorPositions();
  counterOfProposedCombination--;
  console.writeln(`CounterOfProposedCombination: ${counterOfProposedCombination}`);
} while (true);

function showBoard(combinationSecrete) {
  showMainPanel(columnResult, columnProposedCombinations);
  showSecreteCombination(combinationSecrete);
}

function showMainPanel(columnResult, columnProposedCombinations) {
  console.write(`Proposed:  `);
  console.writeln(`Results:`);
  for (let i = 0; i < columnProposedCombinations.length; i++) {
    console.write(`${columnProposedCombinations[i]}  |  `);
    console.writeln(`${columnResult[i]}`);
  }
}

function showSecreteCombination(secreteCombination) {
  if (correctCombination) {
    console.writeln(`Secrete combination: ${secreteCombination}`);
  } else {
    console.writeln(`Secrete combination: ****`);
  }
}

function placeColorInPosition(color, position) {
  let repeatedColor = false;
  if (columnProposedCombinations[counterOfProposedCombination][position] === `N`) {
    for (let i = 0; i <= columnProposedCombinations[counterOfProposedCombination].length; i++) {
      if (columnProposedCombinations[counterOfProposedCombination][i] === color) {
        repeatedColor = true;
      }
      if (!repeatedColor) {
        columnProposedCombinations[counterOfProposedCombination][position] = color;
      }
    }
  }
  return repeatedColor;
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

function setColorInPorposedCombination() {
  let position = console.readNumber(`Select the position to place the chosen color (0-3):`);
  return position;
}

function checkColorPositions() {
  console.writeln(`checkColorPosition()`);
  correctlyPositioned();
  // contemplated();
}

function correctlyPositioned() {
  for (let i = 0; i < columnProposedCombinations[counterOfProposedCombination].length; i++) {
    if (columnProposedCombinations[columnProposedCombinations[counterOfProposedCombination][i] === combinationSecrete[i]]) {
      columnResult[counterOfProposedCombination][i] = `B`;
    }
  }
}

function generateSecreteCombination() {
  const MAX = 6;
  const MIN = 0;
  const FULL = 4;
  let combinationSecrete = [];
  for (let i = 0; i !== FULL; i++) {
    const randomNumber = Math.floor(Math.random() * (MAX - MIN)) + MIN;
    console.writeln(`Random number: ${randomNumber}`);
    if (combinationSecrete.length === 0) {
      combinationSecrete[0] = randomNumber;
    } else {
      let uniqueRandomNumber = true;
      for (let j = 0; uniqueRandomNumber && j < combinationSecrete.length; j++) {
        if (randomNumber === combinationSecrete[j]) {
          uniqueRandomNumber = false;
          i--;
        }
      }
      if (uniqueRandomNumber) {
        combinationSecrete[i] = randomNumber;
      }
    }
  }
  return combinationSecrete;
}
