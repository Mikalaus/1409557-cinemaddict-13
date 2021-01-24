export const createFilmPopupGenres = (genres) => {
  let genresList = ``;
  for (const genre of genres) {
    genresList += `<span class="film-details__genre">${genre}</span>`;
  }

  return genresList;
};
