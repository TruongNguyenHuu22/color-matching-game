import { getPlayAgainButton, getTimerElement } from './selectors.js';

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return arr;
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i); //create a number smaller than i

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
export const getRandomColorPairs = (count) => {
  const colorList = [];
  const hueList = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'monochrome',
  ];

  //random "count colors"
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dart',
      hue: hueList[i % hueList.length],
    });
    colorList.push(color);
  }

  //double current color list
  const fullColorList = [...colorList, ...colorList];

  //suffle
  shuffle(fullColorList);

  return fullColorList;
};

export function showPlayAgainButton() {
  //show replay
  const playAgainButton = getPlayAgainButton();

  if (playAgainButton) {
    playAgainButton.style.display = 'block';
  }
}

export function hidePlayAgainButton() {
  //show replay
  const playAgainButton = getPlayAgainButton();

  if (playAgainButton) {
    playAgainButton.style.removeProperty('display');
  }
}

export function setTimerText(text) {
  const timerElement = getTimerElement();
  if (timerElement) timerElement.textContent = text;
}

export function setTimerCountDown(time) {
  const timerElement = getTimerElement();
  if (timerElement) {
    time--;
    if (time > 0) {
      timerElement.textContent = time;
      setTimeout(
        () => setTimerCountDown(time),
        1000
      ); /* replicate wait 1 second */
    }
    if (time === 0) {
      setTimerText('GAME OVER');
    }
  }
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;
  function start() {
    clear();
    let currentSecond = seconds;
    intervalId = setInterval(() => {
      if (onChange) onChange(currentSecond);
      currentSecond--;
      if (currentSecond < 0) {
        clear();

        onFinish?.();
      }
    }, 1000);
  }
  function clear() {
    clearInterval(intervalId);
  }
  return {
    start,
    clear,
  };
}
