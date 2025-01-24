import SearchMovie from '~types/theMovieDB/SearchMovie';
import IConfiguration from '~types/theMovieDB/IConfiguration';

// add transformation for data
export default class TheMovieDBApi {
  readonly #baseUrl = 'https://api.themoviedb.org/3';

  async #getRecourse(endPoint: string = '') {
    const url = `${this.#baseUrl}${endPoint}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzk1YWI3YjdmYzllNjY1OTRiYTRjMzFkYzAzMjFmZCIsIm5iZiI6MTczNzQwMTc4MS4wNjQ5OTk4LCJzdWIiOiI2NzhlYTViNTg1OWZiNGU2YTg2ZTNiZjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4Z5_tycgLjufktp2yDInir4Uo4kypWjBHefRsWlBG2o',
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error ${url}, ${response.status}`);
    }

    return await response.json();
  }

  async getSearchMovie(): Promise<SearchMovie> {
    return this.#getRecourse('/search/movie?query=return');
  }

  async getConfiguration(): Promise<IConfiguration> {
    return this.#getRecourse('/configuration');
  }
}
