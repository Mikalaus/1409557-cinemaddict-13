import {API} from '../const';
import {EmojiInfo} from '../const';
import {createElement, createCommentMocInfo} from '../util';
import Abstract from './abstract';
import he from "he";
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


const createFilmPopupComment = (commentsList, addedByUser, onlyInfo) => {
  let commentList = ``;
  let info;
  if (addedByUser) {
    const {src, text, alt} = commentsList;
    const {author} = createCommentMocInfo();
    const id = nanoid();
    const now = new Date();
    commentList = `
      <li class="film-details__comment" id="${id}">
        <span class="film-details__comment-emoji">
          <img src="${src}" width="55" height="55" alt="${alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(text)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dayjs(now).format(`DD/MM/YYYY HH:mm`)}</span>
            <button type="button" class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;

    info = {
      id,
      author,
      comment: he.encode(text),
      date: now,
      emotion: src.slice(15, -4)
    };
  } else {
    for (const comment of commentsList) {
      const {id, emotion, text, author, publicationDate} = comment;
      commentList += `
      <li class="film-details__comment" id="${id}">
        <span class="film-details__comment-emoji">
          <img src="${EmojiInfo[emotion].src}" width="55" height="55" alt="${EmojiInfo[emotion].alt}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dayjs(publicationDate).format(`DD/MM/YYYY HH:mm`)}</span>
            <button type="button" class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;
    }
  }
  if (onlyInfo) {
    return info;
  } else {
    commentList = `<div>${commentList}</div>`;
    return commentList;
  }
};

export default class Comment extends Abstract {

  constructor(commentsCountContainer, commentsList, addedByUser = false) {
    super();

    this._addedByUser = addedByUser;
    this._commentsList = commentsList;
    this._commentsCountContainer = commentsCountContainer;
    this._api = API;
  }

  getTemplate(onlyInfo = false) {
    return createFilmPopupComment(this._commentsList, this._addedByUser, onlyInfo);
  }

  _setDeleteButtonClickHandler() {
    this._deleteButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        this._api.deleteComment(button.closest(`.film-details__comment`).id)
          .then(() => {
            button.closest(`.film-details__comment`).remove();
            this._commentsCountContainer.textContent = +this._commentsCountContainer.textContent - 1;
            button.removeAttribute(`disabled`, `disabled`);
          })
          .catch((error) => {
            button.textContent = `Delete`;
            button.removeAttribute(`disabled`, `disabled`);
            throw new Error(error);
          });
        button.setAttribute(`disabled`, `disabled`);
        button.textContent = `Deleting...`;
      });
    });
  }

  getInfo() {
    return this.getTemplate(true);
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
