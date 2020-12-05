import AbstractView from './abstract';

const createFilmListTemplate = (films) => {

  return `
  <section class="films-list">
    <h2 class="films-list__title${films.length ? ` visually-hidden">All movies. Upcoming` : `">There are no movies in our database`}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class ListView extends AbstractView {
  constructor(films) {
    super();
    this._element = films;
  }

  getTemplate() {
    return createFilmListTemplate(this._element);
  }
}
