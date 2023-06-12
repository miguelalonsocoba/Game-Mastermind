const { Console } = require(`console-mpds`);
const console = new Console();

let columnProposedCombinations = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

play();

function play() {
  /**Show board:
   * 1- Show result column.
   * 2- Show proposed combination.
   * 3- Show secret combination.
   * */
  displayBoard();
  chooseOption();
}

function displayBoard() {}

function chooseOption() {
  const selectedOption = console.readNumber(`Select color:
    1 -> RED.
    2 -> GREEN.
    3 -> BLUE.
    4 -> YELLOW.
    5 -> CYAN.
    6 -> MAGENTA.`);
  return selectedOption;
}
