import Api from './api';

/**
 * ограничение на вывод карточек в каждом блоке
 * default - основной блок
 * extra - topRated/mostCommented
 */
const FilmListLimit = {
  DEFAULT: 5,
  EXTRA: 2
};

const FILTERS_LIST = {
  sortByDate: (filmsList) => {
    filmsList.sort((a, b) => {
      return b.yearOfProduction - a.yearOfProduction;
    });

    return filmsList;
  },
  sortByRating: (filmsList) => {
    filmsList.sort((a, b) => {
      return b.rating - a.rating;
    });

    return filmsList;
  },

  sortByComments: (filmsList) => {
    filmsList.sort((a, b) => {
      return b.comments.length - a.comments.length;
    });

    return filmsList;
  },

  sortWatchlist: (filmsList) => {
    return [...filmsList].filter((film) => film.isAddedToWatchlist);
  },

  sortHistory: (filmsList) => {
    return [...filmsList].filter((film) => film.isWatched);
  },

  sortFavourites: (filmsList) => {
    return [...filmsList].filter((film) => film.isFavourite);
  },

  sortByTime: (filmsList, time) => {
    const sortedArr = [];
    filmsList.forEach((item) => {
      if (item.date > time) {
        sortedArr.push(item);
      }
    });
    return sortedArr;
  }
};

const DEFAULT_RENDER_INDEX = 5;

const ENTER_KEY = 13;
const ESC_KEY = 27;
const RIGHT_BUTTON = 0;
const MAX_DESCRIPTION_LENGTH = 140;

const TOP_RATED = `Top Rated`;
const MOST_COMMENTED = `Most Commented`;

const SORT_BUTTON_CLASS = `sort__button`;
const NAV_BUTTON_CLASS = `main-navigation__item`;

const FAN_RANK = 11;
const MOVIE_BUFF_RANK = 21;

const EmojiInfo = {
  angry: {
    src: `images/emoji/angry.png`,
    alt: `emoji-angry`
  },
  puke: {
    src: `images/emoji/puke.png`,
    alt: `emoji-puke`
  },
  sleeping: {
    src: `images/emoji/sleeping.png`,
    alt: `emoji-sleeping`
  },
  smile: {
    src: `images/emoji/smile.png`,
    alt: `emoji-smile`
  }
};

const PopupMode = {
  OPENED: true,
  CLOSED: false
};

const AUTHORIZATION = `Basic dfmdsfmmsmm3do`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const API = new Api(END_POINT, AUTHORIZATION);

export {
  FilmListLimit,
  TOP_RATED,
  MOST_COMMENTED,
  SORT_BUTTON_CLASS,
  NAV_BUTTON_CLASS,
  DEFAULT_RENDER_INDEX,
  PopupMode,
  ENTER_KEY,
  FILTERS_LIST,
  EmojiInfo,
  API,
  ESC_KEY,
  RIGHT_BUTTON,
  MAX_DESCRIPTION_LENGTH,
  FAN_RANK,
  MOVIE_BUFF_RANK
};
