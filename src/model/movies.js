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

  updateFilm(update) {
    const index = this._films.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify();
  }
}
