const sortByDate = (arr) => {
  arr.sort((a, b) => {
    return b.yearOfProduction - a.yearOfProduction;
  });

  return arr;
};

const sortByRating = (arr) => {
  arr.sort((a, b) => {
    return b.rating - a.rating;
  });

  return arr;
};

const sortByComments = (arr) => {
  arr.sort((a, b) => {
    return b.commentsAmount - a.commentsAmount;
  });

  return arr;
};

const sortWatchlist = (arr) => {
  return [...arr].filter((film) => film.isAddedToWatchlist);
};

const sortHistory = (arr) => {
  return [...arr].filter((film) => film.isWatched);
};

const sortFavourites = (arr) => {
  return [...arr].filter((film) => film.isFavourite);
};

export {sortByDate, sortFavourites, sortByRating, sortHistory, sortWatchlist, sortByComments};
