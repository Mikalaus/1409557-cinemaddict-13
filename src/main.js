import {API} from './const';
import MoviesModel from './model/movies';
import BoardPresenter from './presenter/board';

const api = API;

const filmsModel = new MoviesModel();
let board;

api.getMovies()
  .then((movies) => {
    filmsModel.setFilms(movies);
    board = new BoardPresenter(filmsModel);
    board.init();
  });
