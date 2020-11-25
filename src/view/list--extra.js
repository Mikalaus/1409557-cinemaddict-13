export const createFilmListExtraTemplate = (isRated) => {
  return `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${isRated ? `Top Rated` : `Most Commented`}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};
