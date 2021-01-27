import Abstract from './abstract';

const createFilmsTemplate = () => {
  return `
  <section class="films"></section>
  `;
};

export default class Films extends Abstract {
  getTemplate() {
    return createFilmsTemplate();
  }
}
