import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js';
import {
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js';
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  setTimerCountDown,
  setTimerText,
  showPlayAgainButton,
} from './utils.js';

let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2);
  setTimerText(fullSecond);
}
function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED;
  setTimerText('GAME OVER');
  showPlayAgainButton();
}

//TODO
//1. Generating colors using randomColor library
//2. Attach item click for all li elements
//3. Check win logic
//4. Add timer
//5. Handle replay click

function initColors() {
  //random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  //bind to li > div.overlay
  const liList = getColorElementList();

  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];
    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

function handleColorClick(liElement) {
  const shouldBlockClick = [
    GAME_STATUS.BLOCKING,
    GAME_STATUS.FINISHED,
  ].includes(gameStatus);

  const isClicked = liElement.classList.contains('active');

  if (!liElement || isClicked || shouldBlockClick) return;

  liElement.classList.add('active');

  //save clicked cell to selection
  selections.push(liElement);

  if (selections.length < 2) return;

  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;
  if (isMatch) {
    const backgroundColor = getColorBackground();
    if (backgroundColor) {
      backgroundColor.style.backgroundColor = firstColor;
    }
    //check win

    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      showPlayAgainButton();
      //show youWin
      setTimerText('YOU WIN');
      timer.clear();
      gameStatus = GAME_STATUS.FINISHED;
    }
    selections = [];
    return;
  }

  //incase of not match

  //remove active class for 2 li elements

  gameStatus = GAME_STATUS.BLOCKING;

  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');
    //reset selection for next turn;
    selections = [];

    if (gameStatus !== GAME_STATUS.FINISHED) gameStatus = GAME_STATUS.PLAYING;
  }, 500);
}

function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;
    handleColorClick(event.target);
  });
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) return;

  playAgainButton.addEventListener('click', resetGame);
}

function attachTimerCountDown() {
  setTimerCountDown(5);
}

function startTimer() {
  timer.start();
}

function resetGame() {
  //reset global var
  gameStatus = GAME_STATUS.PLAYING;
  selections = [];
  //reset DOM element
  //1. remove active class in li element
  const liList = getColorElementList();
  liList.forEach((liElement) => {
    liElement.classList.remove('active');
  });

  //2. hide replay button
  hidePlayAgainButton();
  //3. clear you win/ timeout text
  setTimerText('');
  //re-generate color
  initColors();

  //start new game
  startTimer();
}
//main
(() => {
  initColors();

  // attachTimerCountDown();
  startTimer();

  attachEventForColorList();

  attachEventForPlayAgainButton();
})();
