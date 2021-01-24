import ListEmptyView from './view/list--empty';
import {renderElement, RenderPosition} from './util';
import LoadingView from './view/loading';
import {API} from './const';
import MoviesModel from './model/movies';
import BoardPresenter from './presenter/board';


const loading = new LoadingView();

const main = document.querySelector(`.main`);

renderElement(main, loading.getElement(), RenderPosition.BEFOREEND);

const api = API;

const filmsModel = new MoviesModel();

api.getMovies()
  .then((movies) => {
    filmsModel.setFilms(movies);
    const board = new BoardPresenter(filmsModel);
    loading.remove();
    board.init();
  })
  .catch((err) => {
    main.innerHTML = ``;
    renderElement(main, new ListEmptyView().getElement(), RenderPosition.BEFOREEND);
    throw err;
  });
