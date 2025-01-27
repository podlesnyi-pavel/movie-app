import { useEffect, useRef, useState } from 'react';
import GalleryMovies from '@components/GalleryMovies';
import TheMovieDBApi from '@api/TheMovieDBApi';
import Movie from '~types/theMovieDB/Movie';
import IConfiguration from '~types/theMovieDB/IConfiguration';
import SearchMovie from '~types/theMovieDB/SearchMovie';
import IAlertError from '~types/IAlertError';
import AppInput from '@components/AppInput';
import { debounce } from 'lodash';
import { IPaginationSettings } from '~types/theMovieDB/enums/IPaginationSettings';
import { TOnChangeCurrentPageFunc } from '~types/TOnChangeCurrentPageFunc';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [configuration, setConfiguration] = useState<IConfiguration | null>(
    null,
  );
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [errorLoad, setErrorLoad] = useState<IAlertError | null>(null);
  const [paginationSettings, setPaginationSettings] =
    useState<IPaginationSettings | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const inputSearchValueRef = useRef('');
  const loadApp = useRef(() => {
    loadConfiguration();

    if (inputSearchValueRef.current) {
      loadMovies();
    }
  });
  const debounceLoadMovies = useRef(debounce(loadMovies, 2000));

  useEffect(() => {
    loadApp.current();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [currentPage]);

  useEffect(() => {
    const debounceLoadMoviesLink = debounceLoadMovies.current;

    return () => {
      debounceLoadMoviesLink.cancel();
    };
  }, [debounceLoadMovies]);

  const theMovieDBApi = new TheMovieDBApi();

  function loadMovies() {
    resetErrorLoad();
    setIsLoadingMovies(true);

    const queries: { [key: string]: string } = {
      query: inputSearchValueRef.current,
      page: String(currentPage),
    };

    theMovieDBApi
      .getSearchMovie(queries)
      .then(onLoadMovies)
      .catch(() => {
        setErrorLoad({
          message: 'Error on loading',
          description: 'Failed to load movies',
        });
      })
      .finally(() => setIsLoadingMovies(false));
  }

  function loadConfiguration() {
    theMovieDBApi.getConfiguration().then((data) => {
      setConfiguration(data);
    });
  }

  function onLoadMovies({ results, page, total_pages }: SearchMovie) {
    setMovies(results);
    setPaginationSettings({ page: page, total: total_pages });
  }

  function resetErrorLoad() {
    setErrorLoad(null);
  }

  function onSearch(searchValue: string) {
    inputSearchValueRef.current = searchValue;
    setIsLoadingMovies(true);
    debounceLoadMovies.current();
  }

  const onChangeCurrentPage: TOnChangeCurrentPageFunc = function (
    page: number,
  ) {
    setCurrentPage(page);
  };

  const mainClass = 'app';

  return (
    <div className="app">
      <main className="app__main">
        <AppInput className="page-search" onInput={onSearch} />

        <GalleryMovies
          movies={movies}
          isLoadingMovies={isLoadingMovies}
          errorLoad={errorLoad}
          loadApp={loadApp.current}
          imgBaseUrl={configuration?.images.secure_base_url}
          className={`${mainClass}__gallery-movies`}
          inputSearchValue={inputSearchValueRef.current}
          paginationSettings={paginationSettings}
          onChangeCurrentPage={onChangeCurrentPage}
        />
      </main>
    </div>
  );
}
