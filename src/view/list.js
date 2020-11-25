export const createFilmListTemplate = (films) => {

  return `
  <section class="films-list">
    <h2 class="films-list__title${films ? ` visually-hidden">All movies. Upcoming` : `">There are no movies in our database`}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};
