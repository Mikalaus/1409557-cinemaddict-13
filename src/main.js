import {AUTHORIZATION, END_POINT} from './const';
import MoviesModel from './model/movies';
import BoardPresenter from './presenter/board';
import Api from "./api";

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new MoviesModel();
let board;
api.getMovies()
  .then((movies) => {
    filmsModel.setFilms(movies);
    board = new BoardPresenter(filmsModel);
    board.init();
  });
