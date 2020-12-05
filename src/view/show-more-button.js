import AbstractView from './abstract';


const createShowMoreButtonTemplate = () => {
  return `
  <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMoreButtonView extends AbstractView {

  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}
