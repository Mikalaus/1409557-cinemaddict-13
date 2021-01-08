import MoviesModel from './model/movies';
import BoardPresenter from './presenter/board';

import {generateFilmCards} from './mocs/films';
import {FILMS_LIMIT} from './const';

const filmsModel = new MoviesModel();

filmsModel.setFilms(generateFilmCards(FILMS_LIMIT));

const board = new BoardPresenter(filmsModel);

board.init();
