import CommentsModel from '../model/comments';
import SmartView from './smart';
import CommentView from './popup--comment';
import {createFilmPopupGenres} from './popup-genres';
import dayjs from '../../node_modules/dayjs';
import {API} from '../const';


import {
  createElement,
  renderTemplate,
  renderElement,
  RenderPosition
} from '../util';

import {ENTER_KEY} from '../const';

const newCommentInputTemplate = `
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
  `;

const createFilmPopupTemplate = (filmInfo) => {

  const {
    title,
    rating,
    duration,
    genre,
    posterURL,
    comments,
    originalTitle,
    producer,
    screenwriter,
    stars,
    country,
    description,
    ageLimit,
    yearOfProduction,
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
                <td class="film-details__cell">${dayjs(yearOfProduction).format(`DD MMMM YYYY`)}</td>
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
                <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${createFilmPopupGenres(genre)}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          </ul>

        ${newCommentInputTemplate}
          
          </div>
        </section>
      </div>
    </form>
  </section>
  `;
};

export default class PopupView extends SmartView {
  constructor(filmCard, cardInfo, menu, updateWatchlist, updateHistory, updateFavourites) {
    super();

    this._cardInfo = cardInfo;
    this._menu = menu;
    this._closeBtn = null;
    this._filmCard = filmCard;
    this._commentsAmount = cardInfo.comments.length;

    this._api = API;

    this._commentsModel = new CommentsModel();

    this._clickHandler = this._clickHandler.bind(this);
    this._commentDispatchHandler = this._commentDispatchHandler.bind(this);

    this._callback.watchlist = updateWatchlist;
    this._callback.history = updateHistory;
    this._callback.favourites = updateFavourites;

    this._form = {
      src: ``,
      alt: ``,
      text: ``
    };
  }

  getTemplate() {
    return createFilmPopupTemplate(this._cardInfo);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._newCommentInput = this._element.querySelector(`.film-details__new-comment`);
      this._commentsContainer = this._element.querySelector(`.film-details__comments-list`);
      this._commentsCountContainer = this._element.querySelector(`.film-details__comments-count`);
    }

    this._setSortButtonsClickHandler();
    this.restoreHandlers();

    this._api.getComments(this._cardInfo.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        renderElement(this._commentsContainer, new CommentView(this._commentsCountContainer, comments).getElement(), RenderPosition.BEFOREEND);
      });

    this._element.querySelector(`.film-details__inner`).addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === ENTER_KEY) {
        evt.preventDefault();
      }
    });

    return this._element;
  }

  _setEmojiClickHandlers() {
    this._emojiInputs = this._element.querySelectorAll(`.film-details__emoji-item`);

    this._emojiInputs.forEach((input) => {
      input.addEventListener(`click`, () => {
        this._form.src = `./images/emoji/${[...input.id].slice(6).join(``)}.png`;
        this._form.alt = input.id;

        this._element.querySelector(`.film-details__add-emoji-label`).style.cssText =
        `
          background: center url("./images/emoji/${[...input.id].slice(6).join(``)}.png") no-repeat;
          background-size: cover;
        `;
      });
    });
  }

  _commentDispatchHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_KEY) {

      const userComment = new CommentView(this._commentsCountContainer, this._form, true);
      this._commentsList = this._commentsContainer;

      this._api.updateComment(userComment.getInfo(), this._cardInfo)
        .then(() => {
          renderElement(this._commentsList, userComment.getElement(), RenderPosition.BEFOREEND);
          this._newCommentInput.remove();
          renderTemplate(this._commentsContainer, newCommentInputTemplate, RenderPosition.AFTEREND);
          this._newCommentInput = this._element.querySelector(`.film-details__new-comment`);

          this.restoreHandlers();
          this._form = {
            src: ``,
            alt: ``,
            text: ``
          };

          this._api.getComments(this._cardInfo.id)
            .then((comments) => {
              this._commentsContainer.innerHTML = ``;
              this._commentsCountContainer.textContent = comments.length;
              this._commentsModel.setComments(comments);
              renderElement(this._commentsContainer, new CommentView(this._commentsCountContainer, comments).getElement(), RenderPosition.BEFOREEND);
            });
        })
        .catch((error) => {
          this._newCommentInput.classList.add(`error-animation`);
          this._textInput.removeAttribute(`disabled`, `disabled`);
          setTimeout(() => {
            this._newCommentInput.classList.remove(`error-animation`);
          }, 1200);
          this._emojiInputs.forEach((emoji) => {
            emoji.removeAttribute(`disabled`, `disabled`);
          });
          throw new Error(error);
        });

      this._textInput.setAttribute(`disabled`, `disabled`);
      this._emojiInputs.forEach((emoji) => {
        emoji.setAttribute(`disabled`, `disabled`);
      });
    }
  }

  _setCommentDispatchHandler() {
    document.addEventListener(`keyup`, this._commentDispatchHandler);
  }

  _setInputHandler() {
    this._textInput = this._element.querySelector(`.film-details__comment-input`);
    this._textInput.addEventListener(`input`, () => {
      this._form.text = this._textInput.value;
    });
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
    document.removeEventListener(`keyup`, this._commentDispatchHandler);
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

      this._cardInfo.isAddedToWatchlist = !this._cardInfo.isAddedToWatchlist;

      this._filmCard.querySelector(`.film-card__controls-item--add-to-watchlist`).classList.toggle(`film-card__controls-item--active`);

      this._callback.watchlist(this._cardInfo);
    });
    this._element.querySelector(`#watched`).addEventListener(`click`, () => {

      this._cardInfo.isWatched = !this._cardInfo.isWatched;

      this._filmCard.querySelector(`.film-card__controls-item--mark-as-watched`).classList.toggle(`film-card__controls-item--active`);

      this._callback.history(this._cardInfo);
    });
    this._element.querySelector(`#favorite`).addEventListener(`click`, () => {

      this._cardInfo.isFavourite = !this._cardInfo.isFavourite;

      this._filmCard.querySelector(`.film-card__controls-item--favorite`).classList.toggle(`film-card__controls-item--active`);

      this._callback.favourites(this._cardInfo);
    });
  }

  restoreHandlers() {
    this._setEmojiClickHandlers();
    this._setCommentDispatchHandler();
    this._setInputHandler();
  }
}
