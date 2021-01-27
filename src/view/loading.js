import Abstract from './abstract';


const createLoadingTemplate = () => {
  return `
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
      </section>
    </section>
  `;
};

export default class Loading extends Abstract {
  getTemplate() {
    return createLoadingTemplate();
  }

  remove() {
    this._element.remove();
    this._element = null;
  }
}
