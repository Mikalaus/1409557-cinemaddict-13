/**
 * ограничение на вывод карточек в каждом блоке
 * default - основной блок
 * extra - topRated/mostCommented
 */
const FilmListLimit = {
  DEFAULT: 5,
  EXTRA: 2
};

const DEFAULT_RENDER_INDEX = 5;

const TOP_RATED = `Top Rated`;
const MOST_COMMENTED = `Most Commented`;

const SORT_BUTTON_CLASS = `sort__button`;
const NAV_BUTTON_CLASS = `main-navigation__item`;

/**
 * ограничение по максимальному кол-ву карточек из моков
 */
const FILMS_LIMIT = 17;

const PopupMode = {
  OPEN: true,
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
  PopupMode
};
