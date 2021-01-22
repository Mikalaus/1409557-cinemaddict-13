import {renderElement, RenderPosition} from './util';
import LoadingView from './view/loading';
import {API} from './const';
import MoviesModel from './model/movies';
import BoardPresenter from './presenter/board';

const loading = new LoadingView();

renderElement(document.querySelector(`.main`), loading.getElement(), RenderPosition.BEFOREEND);

const api = API;

const filmsModel = new MoviesModel();

api.getMovies()
  .then((movies) => {
    filmsModel.setFilms(movies);
    const board = new BoardPresenter(filmsModel);
    loading.remove();
    board.init();
  });
