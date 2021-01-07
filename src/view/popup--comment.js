import {createElement} from '../util';
import {createCommentMocInfo} from '../mocs/films';
import Abstract from './abstract';

const createFilmPopupComment = (commentsList, addedByUser) => {
  let commentList = ``;
  if (addedByUser) {
    const {src, alt, text} = commentsList;
    const {author, publicationDate} = createCommentMocInfo(1)[0];
    commentList = `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${src}" width="55" height="55" alt="${alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${publicationDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;
  } else {
    for (let comment of commentsList) {
      const {emoji: {src, alt}, text, author, publicationDate} = comment;
      commentList += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${src}" width="55" height="55" alt="${alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${publicationDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;
    }

    commentList = `<div>${commentList}</div>`;
  }

  return commentList;
};

export default class CommentView extends Abstract {

  constructor(commentsList, commentsCountContainer, addedByUser = false) {
    super();

    this._commentsList = commentsList;
    this._addedByUser = addedByUser;
    this._commentsCountContainer = commentsCountContainer;
  }

  getTemplate() {
    return createFilmPopupComment(this._commentsList, this._addedByUser);
  }

  _setDeleteButtonClickHandler() {
    this._deleteButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        button.closest(`.film-details__comment`).remove();
        this._commentsCountContainer.textContent = +this._commentsCountContainer.textContent - 1;
      });
    });
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createFilmPopupComment(this._commentsList, this._addedByUser));
    }

    this._deleteButtons = this._element.querySelectorAll(`.film-details__comment-delete`);
    this._setDeleteButtonClickHandler();

    return this._element;
  }
}
