import { generateSecret } from './core/generateSecret.js';
import { evaluateGuess } from './core/evaluateGuess.js';
import { isValidGuess } from './core/isValidGuess.js';
import { createDigitValidator } from './core/createDigitValidator.js';
import { countPossibleSecrets } from './core/countPossibleSecrets.js';

const lengthSelect = document.querySelector<HTMLSelectElement>('#length');
const baseSelect = document.querySelector<HTMLSelectElement>('#base');
const guessInput = document.querySelector<HTMLInputElement>('#guess');
const guessForm = document.querySelector<HTMLFormElement>('#guess-form');
const message = document.querySelector<HTMLParagraphElement>('#message');
const history = document.querySelector<HTMLOListElement>('#history');
const newGameButton = document.querySelector<HTMLButtonElement>('#new-game');
if (
  !lengthSelect ||
  !baseSelect ||
  !guessInput ||
  !guessForm ||
  !message ||
  !history ||
  !newGameButton
) {
  throw new Error('Game elements not found');
}
const elements = {
  lengthSelect,
  baseSelect,
  guessInput,
  guessForm,
  message,
  history,
  newGameButton,
};
let secret = '';
let attempts = 0;
let isGameOver = false;
let currentLength = Number(lengthSelect.value);
let currentBase = Number(baseSelect.value);
function startGame(): void {
  currentLength = Number(elements.lengthSelect.value);
  currentBase = Number(elements.baseSelect.value);
  secret = generateSecret(currentLength, currentBase);
  attempts = 0;
  isGameOver = false;

  elements.history.replaceChildren();
  elements.guessInput.value = '';
  elements.guessInput.maxLength = currentLength;
  elements.guessInput.disabled = false;

  elements.message.textContent = `Новая игра! Возможных комбинаций: ${countPossibleSecrets(currentLength, currentBase)}`;
}
elements.newGameButton.addEventListener('click', startGame);
elements.lengthSelect.addEventListener('change', startGame);
elements.baseSelect.addEventListener('change', startGame);

startGame();
elements.guessInput.addEventListener('input', () => {
  const isValidDigit = createDigitValidator(currentBase);

  const normalizedValue = elements.guessInput.value
    .toLowerCase()
    .split('')
    .filter(isValidDigit)
    .filter((digit, index, digits) => digits.indexOf(digit) === index)
    .slice(0, currentLength)
    .join('');

  elements.guessInput.value = normalizedValue;
});

elements.guessForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (isGameOver) {
    return;
  }

  const guess = elements.guessInput.value;

  if (!isValidGuess(guess, currentLength, currentBase)) {
    elements.message.textContent = 'Некорректная комбинация';
    return;
  }

  attempts++;

  const result = evaluateGuess(secret, guess);

  const listItem = document.createElement('li');
  listItem.textContent = `${guess} — Быки: ${result.bulls}, коровы: ${result.cows}`;
  elements.history.append(listItem);

  if (result.bulls === currentLength) {
    isGameOver = true;
    elements.message.textContent = `Победа! Вы угадали за ${attempts} попыток.`;
    elements.guessInput.disabled = true;
  } else {
    elements.message.textContent = `Попытка ${attempts}. Продолжайте!`;
  }

  elements.guessInput.value = '';
});
