import {getRandomElementFromArray, getRandomInteger, getRandomElementsFromArray} from '../util.js';
import dayjs from '../../node_modules/dayjs';

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
    alt: `emoji-smile`}];

const DUMMY_TEXT = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra. Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`];

const AUTHORS = [`Sherlock`, `Troll228`, `Tenderlybae`, `Hesus`, `Topa`];

const POSTER_URL = [`images/posters/made-for-each-other.png`,
  `images/posters/sagebrush-trail.jpg`,
  `images/posters/popeye-meets-sinbad.png`,
  `images/posters/santa-claus-conquers-the-martians.jpg`,
  `images/posters/the-dance-of-life.jpg`,
  `images/posters/the-great-flamarion.jpg`,
  `images/posters/the-man-with-the-golden-arm.jpg`];

const GENRE = [`horror`, `comedy`, `thriller`, `drama`, `detective`];

const PRODUCERS = [`Christopher Nolan`, `Dmitry Bikov`, `Quentin Tarantino`, `M. Night Shyamalan`];
const SCREENWRITERS = [`Aleksey Balabanov`, `Woody Alen`, ...PRODUCERS];

const STARING = [`Leonardo Di Caprio`, `Tom Holland`, `Woody Harellson`, `Tom Hanks`, `Tom Hardy`, `Killian Murphy`];

const COUNTRIES = [`USA`, `UK`, `Australia`, `Russia`, `Germany`, `France`];

const AGE_LIMITS = [0, 6, 12, 16, 18];

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

const createExtendedFilmMocInfo = (title) => {
  return {
    originalTitle: title.en,
    producer: getRandomElementFromArray(PRODUCERS),
    screenwriter: getRandomElementsFromArray(SCREENWRITERS),
    stars: getRandomElementsFromArray(STARING),
    country: getRandomElementFromArray(COUNTRIES),
    fullDescription: getRandomElementFromArray(DUMMY_TEXT),
    ageLimit: getRandomElementFromArray(AGE_LIMITS),
    date: createRandDatePopup()
  };
};

const createRandDateComment = () => {
  return dayjs(`${2020 - getRandomInteger()}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 30)}-${getRandomInteger(0, 24)}:${getRandomInteger(0, 60)}`).format(`HH:mm DD/MM/YYYY`);
};

const createRandDatePopup = () => {
  return dayjs(`${getRandomInteger(1970, 2020)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 31)}`).format(`YYYY-MM-DD`);
};

const generateFilmCard = () => {
  const COMMENTS_AMOUNT = getRandomInteger(0, 100);
  const FILM_TITLE = getRandomElementFromArray(FILM_TITLES);
  return {
    title: FILM_TITLE.ru,

    posterURL: getRandomElementFromArray(POSTER_URL),

    description: getRandomElementFromArray(DUMMY_TEXT),

    rating: getRandomInteger(0, 100) / 10,

    yearOfProduction: getRandomInteger(1970, 2020),

    duration: `${getRandomInteger(1, 3)}h ${getRandomInteger(0, 59)}m`,

    genre: getRandomElementsFromArray(GENRE),

    commentsnumber: getRandomInteger(0, 12),

    isWatched: Boolean(getRandomInteger()),

    isAddedToWatchlist: Boolean(getRandomInteger()),

    isFavourite: Boolean(getRandomInteger()),

    commentsAmount: COMMENTS_AMOUNT,

    comments: createCommentMocInfo(COMMENTS_AMOUNT),

    popup: createExtendedFilmMocInfo(FILM_TITLE)
  };
};

export const generateFilmCards = (limit) => {
  let generateFilmList = [];
  for (let i = 0; i < limit; i++) {
    generateFilmList.push(generateFilmCard()); // генерация всех карточек в моках
  }
  return generateFilmList;
};
