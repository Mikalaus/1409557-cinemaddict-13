export const createFilmListTemplate = (isExtra = false, isTopRated = false, isMostCommented = false) => {
  return `<section class="films-list${isTopRated ? ` films-list--extra films-list--top-rated` : ``}${isMostCommented ? ` films-list--extra films-list--most-commented` : ``}">
  <h2 class="films-list__title}${!isExtra ? ` visually-hidden` : ``}">${isTopRated ? `Top rated` : ``}${isMostCommented ? `Most commented` : ``}${!isExtra ? `All movies. Upcoming` : ``}</h2>
  <div class="films-list__container"></div>
</section>`;
};
