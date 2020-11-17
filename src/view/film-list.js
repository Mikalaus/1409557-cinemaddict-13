export const createFilmListTemplate = (isExtra = false, isTopRated = false) => {
  return `<section class="films-list${!isExtra ? `` : isTopRated ? ` films-list--extra films-list--top-rated` : ` films-list--extra films-list--most-commented`}">
  <h2 class="films-list__title${!isExtra ? ` visually-hidden` : ``}">${!isExtra ? `All movies. Upcoming` : isTopRated ? `Top rated` : `Most commented`}</h2>
  <div class="films-list__container"></div>
</section>`;
};
