import SearchMovie from '~types/theMovieDB/SearchMovie';
import IConfiguration from '~types/theMovieDB/IConfiguration';

// add transformation for data
export default class TheMovieDBApi {
  readonly #baseUrl = 'https://api.themoviedb.org/';
  readonly #baseVersion = '3';

  async #getRecourse(
    pathname: string = '',
    search?: { [key: string]: string },
  ) {
    const url = new URL(pathname, this.#baseUrl);

    if (search) {
      const searchParams = new URLSearchParams(search);
      url.search = searchParams.toString();
    }

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

  async getSearchMovie(search: {
    [key: string]: string;
  }): Promise<SearchMovie> {
    return this.#getRecourse(this.#getPath('/search/movie'), search);
  }

  async getConfiguration(): Promise<IConfiguration> {
    return this.#getRecourse(this.#getPath('/configuration'));
  }

  #getPath(path: string): string {
    return `${this.#baseVersion}${path}`;
  }
}
