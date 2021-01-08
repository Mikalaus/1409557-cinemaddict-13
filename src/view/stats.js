import {parseRuntimeToString, capitalizeWord} from '../util';
import {FiltersList} from '../const';
import Smart from './smart';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {createElement} from '../util';

const createStatsTemplate = (rank, moviesAmount, totalDuration, topGenre) => {

  return `
  <section class="statistic">
    
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${moviesAmount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `;
};

const renderFilmsChart = (genres, count) => {
  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`);

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: count,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    },
    plugins: [ChartDataLabels],
  });
};

export default class StatsView extends Smart {
  constructor(rank, filmModel) {
    super();
    this._rank = rank;
    this._filmModel = filmModel;
    this._data = {
      rank: this._rank,
      duration: this._getTotalDuration(),
      moviesAmount: this._getMoviesAmount(),
      genres: this._getGenres()
    };
  }

  getTemplate() {
    this.updateData({duration: this._getTotalDuration(), moviesAmount: this._getMoviesAmount(), genres: this._getGenres()}, true);
    return createStatsTemplate(this._data.rank, this._data.moviesAmount, this._data.duration, [...this._data.genres.keys()][0]);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setChart() {
    this._keys = [...this._genresCount.keys()];
    for (let i = 0; i < this._keys.length; i++) {
      this._keys[i] = capitalizeWord(this._keys[i]);
    }
    this._filmsChart = renderFilmsChart(this._keys, [...this._genresCount.values()]);
  }

  _getTotalDuration() {
    let time = 0;
    FiltersList.sortHistory(this._filmModel.getFilms().slice()).forEach((film) => {
      time += film.duration;
    });

    return parseRuntimeToString(time);
  }

  _getGenres() {
    this._genres = [];
    FiltersList.sortHistory(this._filmModel.getFilms().slice()).forEach((film) => {
      this._genres.push(...film.genre);
    });

    this._uniqueGenres = Array.from(new Set(this._genres));

    this._genresCount = {};
    this._uniqueGenres.forEach((uniqueGenre) => {
      this._genresCount[uniqueGenre] = 0;
      this._genres.forEach((genre) => {
        if (genre === uniqueGenre) {
          this._genresCount[uniqueGenre] += 1;
        }
      });
    });

    this._genresCount = new Map(Object.entries(this._genresCount).sort((a, b) => b[1] - a[1]));

    return this._genresCount;
  }

  _getMoviesAmount() {
    return FiltersList.sortHistory(this._filmModel.getFilms().slice()).length;
  }

  restoreHandlers() {
    return;
  }

  destroy() {
    this._element.remove();
    this._element = null;
  }
}
