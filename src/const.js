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

const FiltersList = {
  sortByDate: (arr) => {
    arr.sort((a, b) => {
      return b.yearOfProduction - a.yearOfProduction;
    });

    return arr;
  },
  sortByRating: (arr) => {
    arr.sort((a, b) => {
      return b.rating - a.rating;
    });

    return arr;
  },

  sortByComments: (arr) => {
    arr.sort((a, b) => {
      return b.comments.length - a.comments.length;
    });

    return arr;
  },

  sortWatchlist: (arr) => {
    return [...arr].filter((film) => film.isAddedToWatchlist);
  },

  sortHistory: (arr) => {
    return [...arr].filter((film) => film.isWatched);
  },

  sortFavourites: (arr) => {
    return [...arr].filter((film) => film.isFavourite);
  }
};

const DEFAULT_RENDER_INDEX = 5;

const ENTER_KEY = 13;

const TOP_RATED = `Top Rated`;
const MOST_COMMENTED = `Most Commented`;

const SORT_BUTTON_CLASS = `sort__button`;
const NAV_BUTTON_CLASS = `main-navigation__item`;

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

const AUTHORIZATION = `Basic 12345asdfg`;
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
  FiltersList,
  EmojiInfo,
  AUTHORIZATION,
  END_POINT,
  API
};
