import BoardPresenter from './presenter/board';
import {generateFilmCards} from './mocs/films';
import {FILMS_LIMIT} from './const';

const generatedFilmCards = generateFilmCards(FILMS_LIMIT);

const board = new BoardPresenter(generatedFilmCards);

board.init();
