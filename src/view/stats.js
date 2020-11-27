import {createElement} from '../util';


const createStatsTemplate = (moviesAmount) => {
  return `
  <section class="footer__statistics">
    <p>${moviesAmount} movies inside</p>
  </section>
  `;
};

export default class StatsView {
  constructor(moviesAmount) {
    this._element = moviesAmount;
  }

  getTemplate() {
    return createStatsTemplate(this._element);
  }

  getElement() {
    if (this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
