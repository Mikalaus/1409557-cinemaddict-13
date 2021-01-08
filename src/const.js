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
      return b.commentsAmount - a.commentsAmount;
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

/**
 * ограничение по максимальному кол-ву карточек из моков
 */
const FILMS_LIMIT = 38;

const PopupMode = {
  OPENED: true,
  CLOSED: false
};

export {
  FilmListLimit,
  TOP_RATED,
  MOST_COMMENTED,
  SORT_BUTTON_CLASS,
  NAV_BUTTON_CLASS,
  FILMS_LIMIT,
  DEFAULT_RENDER_INDEX,
  PopupMode,
  ENTER_KEY,
  FiltersList
};
