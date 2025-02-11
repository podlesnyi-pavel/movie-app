import SearchMovie from '@/types/theMovieDB/SearchMovie';
import IConfiguration from '@/types/theMovieDB/IConfiguration';
import { ERestMethod } from '@/types/REST/ERestMethod';
import HttpError from '@/errors/HttpError';

interface IGetRequestProps {
  pathname: string;
  search?: {
    [key: string]: string;
  };
  method?: ERestMethod;
  body?: { [key: string]: unknown };
}

export default class TheMovieDBApi {
  readonly #baseUrl = 'https://api.themoviedb.org/';
  readonly #baseVersion = '3';

  async #getRequest({
    pathname,
    search,
    method = ERestMethod.Get,
    body,
  }: IGetRequestProps) {
    interface IOptions {
      method: ERestMethod;
      headers: {
        accept: string;
        'Content-Type'?: string;
        Authorization: string;
      };
      body?: string;
    }

    const url = new URL(pathname, this.#baseUrl);

    if (search) {
      const searchParams = new URLSearchParams(search);
      url.search = searchParams.toString();
    }

    let options: IOptions = {
      method,
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzk1YWI3YjdmYzllNjY1OTRiYTRjMzFkYzAzMjFmZCIsIm5iZiI6MTczNzQwMTc4MS4wNjQ5OTk4LCJzdWIiOiI2NzhlYTViNTg1OWZiNGU2YTg2ZTNiZjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4Z5_tycgLjufktp2yDInir4Uo4kypWjBHefRsWlBG2o',
      },
    };

    if (method === ERestMethod.Post) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new HttpError({
        message: `Error ${url}, ${response.status}`,
        status: response.status,
      });
    }

    return await response.json();
  }

  async getSearchMovie(search: {
    [key: string]: string;
  }): Promise<SearchMovie> {
    return this.#getRequest({
      pathname: this.#getPath('/search/movie'),
      search,
    });
  }

  async loadRatedMovies(
    guestSessionId: string,
    search: {
      [key: string]: string;
    },
  ) {
    const pathname = this.#getPath(
      `/guest_session/${guestSessionId}/rated/movies`,
    );
    return this.#getRequest({ pathname, search });
  }

  async getConfiguration(): Promise<IConfiguration> {
    return this.#getRequest({ pathname: this.#getPath('/configuration') });
  }

  async createGuestSession() {
    return this.#getRequest({
      pathname: this.#getPath('/authentication/guest_session/new'),
    });
  }

  async addRating(rating: number, id: number, guestSessionId: string) {
    return this.#getRequest({
      pathname: this.#getPath(`/movie/${id}/rating`),
      method: ERestMethod.Post,
      body: {
        value: rating,
      },
      search: {
        guest_session_id: guestSessionId,
      },
    });
  }

  async getGenres() {
    return this.#getRequest({ pathname: this.#getPath('/genre/movie/list') });
  }

  #getPath(path: string): string {
    return `${this.#baseVersion}${path}`;
  }
}
