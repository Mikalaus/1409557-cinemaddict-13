export const createFilmPopupComment = (commentsList) => {
  let commentList = ``;
  for (let comment of commentsList) {
    const {emoji: {src, alt}, text, author, date} = comment;
    commentList += `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${src}" width="55" height="55" alt="${alt}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
    `;
  }

  return commentList;
};
