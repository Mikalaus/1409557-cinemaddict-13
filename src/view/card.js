import AbstractView from './abstract';

const createFilmCardTemplate = (obj) => {

  const {
    id,
    title,
    rating,
    yearOfProduction,
    duration,
    genre,
    posterURL,
    description,
    commentsAmount} = obj;

  return `
  <article class="film-card" id="${id}">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${yearOfProduction}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre.join(`, `)}</span>
    </p>
    <img src=${posterURL} alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > 140 ? description.substr(0, 139) + `...` : description}</p>
    <a class="film-card__comments">${commentsAmount} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>
  `;
};

export default class FilmCardView extends AbstractView {
  constructor(filmInfo) {
    super();
    this._filmInfo = filmInfo;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmInfo);
  }
}
