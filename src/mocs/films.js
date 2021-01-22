import {getRandomElementFromArray, getRandomInteger, getRandomElementsFromArray} from '../util.js';
import dayjs from '../../node_modules/dayjs';
import {nanoid} from 'nanoid';

const FILM_TITLES = [
  {
    ru: `Начало`,
    en: `Inception`
  },
  {
    ru: `Мстители`,
    en: `Avangers`
  },
  {
    ru: `Мандалорец`,
    en: `The Mandalorian`
  },
  {
    ru: `Зеленая Миля`,
    en: `The Green Mile`
  },
  {
    ru: `Форд против Ферарри`,
    en: `Ford vs Ferarri`
  },
];

const EMOJI = [
  {src: `images/emoji/angry.png`,
    alt: `emoji-angry`},
  {src: `images/emoji/puke.png`,
    alt: `emoji-puke`},
  {src: `images/emoji/sleeping.png`,
    alt: `emoji-sleeping`},
  {src: `images/emoji/smile.png`,
    alt: `emoji-smile`}
];

const DUMMY_TEXT = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra. Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`];

const AUTHORS = [`Sherlock`, `Troll228`, `Tenderlybae`, `Hesus`, `Topa`];

const createCommentMocInfo = (amount) => {
  let commentsList = [];

  for (let i = 0; i < amount; i++) {
    commentsList.push({
      publicationDate: createRandDateComment(),
      author: getRandomElementFromArray(AUTHORS),
      text: getRandomElementFromArray(DUMMY_TEXT),
      emoji: getRandomElementFromArray(EMOJI)
    });
  }
  return commentsList;
};

const createRandDateComment = () => {
  return dayjs(`${2020 - getRandomInteger()}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 30)}-${getRandomInteger(0, 24)}:${getRandomInteger(0, 60)}`).format(`HH:mm DD/MM/YYYY`);
};

export {createCommentMocInfo};
