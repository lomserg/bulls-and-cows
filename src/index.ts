import { generateSecret } from './core/generateSecret.js';
import { evaluateGuess } from './core/evaluateGuess.js';
import { isValidGuess } from './core/isValidGuess.js';
import { createDigitValidator } from './core/createDigitValidator.js';
import { countPossibleSecrets } from './core/countPossibleSecrets.js';
import { addRecord, getTopRecords, loadRecords } from './core/leaderboard.js';

const lengthSelect = document.querySelector<HTMLSelectElement>('#length');
const baseSelect = document.querySelector<HTMLSelectElement>('#base');
const guessInput = document.querySelector<HTMLInputElement>('#guess');
const guessForm = document.querySelector<HTMLFormElement>('#guess-form');
const message = document.querySelector<HTMLParagraphElement>('#message');
const history = document.querySelector<HTMLOListElement>('#history');
const newGameButton = document.querySelector<HTMLButtonElement>('#new-game');
const recordsBody = document.querySelector<HTMLTableSectionElement>('#records-body');
const startGameButton = document.querySelector<HTMLButtonElement>('#start-game');
const historySection = document.querySelector<HTMLElement>('#history-section');
if (
  !lengthSelect ||
  !baseSelect ||
  !guessInput ||
  !guessForm ||
  !message ||
  !history ||
  !newGameButton ||
  !startGameButton ||
  !historySection ||
  !recordsBody
) {
  console.table({
    lengthSelect: lengthSelect !== null,
    baseSelect: baseSelect !== null,
    guessInput: guessInput !== null,
    guessForm: guessForm !== null,
    message: message !== null,
    history: history !== null,
    newGameButton: newGameButton !== null,
    recordsBody: recordsBody !== null,
    startGameButton: startGameButton !== null,
    historySection: historySection !== null,
  });
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
  recordsBody,
  startGameButton,
  historySection,
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
  elements.lengthSelect.disabled = true;
  elements.baseSelect.disabled = true;

  elements.startGameButton.hidden = true;
  elements.guessForm.hidden = false;
  elements.historySection.hidden = false;
  elements.newGameButton.hidden = false;
}

function returnToSetup(): void {
  secret = '';
  attempts = 0;
  isGameOver = false;

  elements.lengthSelect.disabled = false;
  elements.baseSelect.disabled = false;

  elements.guessForm.hidden = true;
  elements.historySection.hidden = true;
  elements.newGameButton.hidden = true;
  elements.startGameButton.hidden = false;

  elements.guessInput.value = '';
  elements.history.replaceChildren();

  elements.message.textContent = 'Выберите настройки и начните игру.';
}

function updateLengthOptions(): void {
  const isBinary = Number(elements.baseSelect.value) === 2;

  Array.from(elements.lengthSelect.options).forEach((option) => {
    option.disabled = isBinary && Number(option.value) !== 2;
  });

  if (isBinary) {
    elements.lengthSelect.value = '2';
  }

  currentLength = Number(elements.lengthSelect.value);
  currentBase = Number(elements.baseSelect.value);

  renderRecords();
}
elements.startGameButton.addEventListener('click', startGame);

elements.newGameButton.addEventListener('click', returnToSetup);

elements.lengthSelect.addEventListener('change', updateLengthOptions);

elements.baseSelect.addEventListener('change', updateLengthOptions);

updateLengthOptions();
function renderRecords(): void {
  const top = getTopRecords(loadRecords(), currentLength, currentBase);

  elements.recordsBody.replaceChildren(
    ...top.map((record, index) => {
      const row = document.createElement('tr');

      const cells = [
        String(index + 1),
        String(record.attempts),
        new Date(record.date).toLocaleDateString('ru-RU'),
      ];

      cells.forEach((text) => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
      });

      return row;
    }),
  );
}
renderRecords();
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

    addRecord({
      attempts,
      length: currentLength,
      base: currentBase,
      date: new Date().toISOString(),
    });

    renderRecords();

    elements.message.textContent = `Победа! Вы угадали за ${attempts} попыток.`;
    elements.guessInput.disabled = true;
  } else {
    elements.message.textContent = `Попытка ${attempts}. Продолжайте!`;
  }

  elements.guessInput.value = '';
});
