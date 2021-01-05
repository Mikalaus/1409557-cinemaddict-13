import AbstractView from './abstract';


const createMoviesStatsTemplate = (moviesAmount) => {
  return `
  <section class="footer__statistics">
    <p>${moviesAmount} movies inside</p>
  </section>
  `;
};

export default class MoviesStatsView extends AbstractView {
  constructor(moviesAmount) {
    super();
    this._moviesAmount = moviesAmount;
  }

  getTemplate() {
    return createMoviesStatsTemplate(this._moviesAmount);
  }
}
