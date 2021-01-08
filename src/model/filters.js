import Observer from "../observer";

export default class Filters extends Observer {

  constructor() {
    super();
    this._activeFilter = Array.from;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._notify();
  }

  getFilter() {
    return this._activeFilter;
  }
}
