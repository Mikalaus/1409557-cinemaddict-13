import Observer from "../observer";

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setSortedFilms(sort) {
    this._sortedFilms = sort(this._films.slice());
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  getSortedFilms() {
    return this._sortedFilms;
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          id: movie.id,
          title: movie.film_info.title,
          posterURL: movie.film_info.poster,
          description: movie.film_info.description,
          rating: movie.film_info.total_rating,
          yearOfProduction: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
          duration: movie.film_info.runtime,
          genre: movie.film_info.genre,
          isWatched: movie.user_details.already_watched,
          isAddedToWatchlist: movie.user_details.watchlist,
          isFavourite: movie.user_details.favorite,
          date: movie.user_details.watching_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date,
          comments: movie.comments,
          originalTitle: movie.film_info.alternative_title,
          producer: movie.film_info.director,
          screenwriter: movie.film_info.writers,
          stars: movie.film_info.actors,
          country: movie.film_info.release.release_country,
          ageLimit: movie.film_info.age_rating,
        }
    );

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        {
          "film_info": {
            "title": movie.title,
            "alternative_title": movie.originalTitle,
            "total_rating": movie.rating,
            "poster": movie.posterURL,
            "age_rating": movie.ageLimit,
            "director": movie.producer,
            "writers": [
              movie.screenwriter
            ],
            "actors": [
              movie.stars
            ],
            "release": {
              "date": movie.yearOfProduction instanceof Date ? movie.yearOfProduction.toISOString() : null,
              "release_country": movie.country
            },
            "runtime": movie.duration,
            "genre": [
              movie.genre
            ],
            "description": movie.description
          },
          "user_details": {
            "watchlist": movie.isAddedToWatchlist,
            "already_watched": movie.isWatched,
            "watching_date": movie.date instanceof Date ? movie.date.toISOString() : null,
            "favorite": movie.isFavourite
          },
          "comments": movie.comments,
        });

    return adaptedMovie;
  }

  updateFilm(update) {
    const index = this._films.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify();
  }
}
