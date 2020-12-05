import AbstractView from './abstract';

const createFilmsTemplate = () => {
  return `
  <section class="films"></section>
  `;
};

export default class FilmsView extends AbstractView {
  getTemplate() {
    return createFilmsTemplate();
  }
}
