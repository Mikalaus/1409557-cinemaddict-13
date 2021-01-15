import {EmojiInfo} from '../const';
import {createElement} from '../util';
import {createCommentMocInfo} from '../mocs/films';
import Abstract from './abstract';
import he from "he";
import dayjs from '../../node_modules/dayjs';
import {nanoid} from 'nanoid';

const createFilmPopupComment = (commentsList, addedByUser) => {
  let commentList = ``;
  if (addedByUser) {
    const {src, alt, text} = commentsList;
    const {author, publicationDate} = createCommentMocInfo(1)[0];
    commentList = `
      <li class="film-details__comment id="${nanoid()}">
        <span class="film-details__comment-emoji">
          <img src="${src}" width="55" height="55" alt="${alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(text)}</p>
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
      const {id, emotion, text, author, publicationDate} = comment;
      commentList += `
      <li class="film-details__comment id="${id}">
        <span class="film-details__comment-emoji">
          <img src="${EmojiInfo[emotion].src}" width="55" height="55" alt="${EmojiInfo[emotion].alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dayjs(publicationDate).format(`HH:mm DD/MM/YYYY`)}</span>
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

  constructor(commentsCountContainer, commentsList, addedByUser = false) {
    super();

    this._addedByUser = addedByUser;
    this._commentsList = commentsList;
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
      this._element = createElement(this.getTemplate());
    }

    this._deleteButtons = this._element.querySelectorAll(`.film-details__comment-delete`);
    this._setDeleteButtonClickHandler();

    return this._element;
  }
}
