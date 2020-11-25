export const createProfileLevelTemplate = (movies) => {
  let rank = `novice`;
  let template;
  if (movies > 11 && movies < 21) {
    rank = `fan`;
  } else if (movies > 20) {
    rank = `movie buff`;
  }

  if (movies > 0) {
    template = `
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `;
  }

  return template;
};
