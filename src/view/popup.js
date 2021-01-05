import AbstractView from './abstract';
import {createFilmPopupComment} from './popup--comment.js';
import {createFilmPopupGenres} from './popup-genres.js';
import {createElement} from '../util';


const createFilmPopupTemplate = (filmInfo) => {

  const {
    title,
    rating,
    duration,
    genre,
    posterURL,
    commentsAmount,
    comments,
    originalTitle,
    producer,
    screenwriter,
    stars,
    country,
    fullDescription,
    ageLimit,
    date,
    isWatched,
    isAddedToWatchlist,
    isFavourite
  } = filmInfo;

  return `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${posterURL} alt="">

            <p class="film-details__age">${ageLimit}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${producer}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${screenwriter.length === 1 ? screenwriter.join(``) : screenwriter.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${stars.length === 1 ? stars.join(``) : stars.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${createFilmPopupGenres(genre)}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${fullDescription}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isAddedToWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavourite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

          <ul class="film-details__comments-list">
            ${createFilmPopupComment(comments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>
  `;
};

export default class PopupView extends AbstractView {
  constructor(filmCard, cardInfo, menu, updateWatchlist, updateHistory, updateFavourites) {
    super();
    this._cardInfo = cardInfo;
    this._menu = menu;
    this._closeBtn = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._callback.watchlist = updateWatchlist;
    this._callback.history = updateHistory;
    this._callback.favourites = updateFavourites;
    this._filmCard = filmCard;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._cardInfo);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    this._setSortButtonsClickHandler();
    return this._element;
  }


  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.click = callback;
    this._getCloseButton().addEventListener(`mousedown`, this._clickHandler);
  }

  _getCloseButton() {
    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    return this._closeBtn;
  }

  _setSortButtonsClickHandler() {
    this._element.querySelector(`#watchlist`).addEventListener(`click`, () => {

      if (this._cardInfo.isAddedToWatchlist) {
        this._cardInfo.isAddedToWatchlist = false;
      } else {
        this._cardInfo.isAddedToWatchlist = true;
      }

      this._filmCard.querySelector(`.film-card__controls-item--add-to-watchlist`).classList.toggle(`film-card__controls-item--active`);

      this._callback.watchlist();
    });
    this._element.querySelector(`#watched`).addEventListener(`click`, () => {

      if (this._cardInfo.isWatched) {
        this._cardInfo.isWatched = false;
      } else {
        this._cardInfo.isWatched = true;
      }

      this._filmCard.querySelector(`.film-card__controls-item--mark-as-watched`).classList.toggle(`film-card__controls-item--active`);

      this._callback.history();
    });
    this._element.querySelector(`#favorite`).addEventListener(`click`, () => {

      if (this._cardInfo.isFavourite) {
        this._cardInfo.isFavourite = false;
      } else {
        this._cardInfo.isFavourite = true;
      }

      this._filmCard.querySelector(`.film-card__controls-item--favorite`).classList.toggle(`film-card__controls-item--active`);

      this._callback.favourites();
    });
  }
}
