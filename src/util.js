const getRandomElementFromArray = (arr) => {
  return arr[getRandomInteger(0, arr.length - 1)];
};

const getRandomElementsFromArray = (arr) => {
  const randWords = new Set();

  while (randWords.size <= getRandomInteger(0, arr.length - 1)) {
    randWords.add(arr[getRandomInteger(0, arr.length - 1)]);
  }
  return Array.from(randWords);
};

/**
 * случайное число
 * @param {number} min
 * @param {number} max
 * @return {number} rand
 */
const getRandomInteger = (min = 0, max = 1) => {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

export {getRandomElementFromArray, getRandomInteger, getRandomElementsFromArray};
