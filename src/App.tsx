import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import GalleryMovies from '@components/GalleryMovies';
import IMovie, { IRatedMovie } from '@/types/theMovieDB/IMovie';
import IConfiguration from '@/types/theMovieDB/IConfiguration';
import SearchMovie from '@/types/theMovieDB/SearchMovie';
import IAlertError from '@/types/IAlertError';
import AppInput from '@components/AppInput';
import { debounce } from 'lodash';
import { IPaginationSettings } from '@/types/theMovieDB/enums/IPaginationSettings';
import { TOnChangePageFunc } from '@/types/TOnChangePageFunc';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { IGuestSession } from '@/types/theMovieDB/IGuestSession';
import { theMovieDBApiContext } from '@/context/theMovieDBApiContext';
import { ETabType } from '@/types/enums/ETabType';
import ErrorBoundary from '@components/ErrorBoundary';
import { EStatusCode } from '@/types/REST/EStatusCode';
import { genresContext } from '@/context/genresContext';
import { IGenre } from '@/types/theMovieDB/IGenre';
import LocalStorageService from '@utils/LocalStorageService';
import { ELocalStorageItem } from '@/types/enums/ELocalStorageItem';
import IDataRatedMovie from '@/types/theMovieDB/IDataRatedMovie';

export default function App() {
  const [search, setSearch] = useState('');
  const [configuration, setConfiguration] = useState<IConfiguration | null>(
    null,
  );
  const [genres, setGenres] = useState<IGenre[]>([]);

  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [paginationMovies, setPaginationMovies] =
    useState<IPaginationSettings | null>(null);
  const [errorLoad, setErrorLoad] = useState<IAlertError | null>(null);
  const [searchPage, setSearchPage] = useState(1);

  const [ratedMovies, setRatedMovies] = useState<IRatedMovie[]>([]);
  const [isLoadingRatedMovies, setIsLoadingRatedMovies] = useState(false);
  const [paginationRatedMovies, setPaginationRatedMovies] =
    useState<IPaginationSettings | null>(null);
  const [errorRatedMovies, setErrorRatedMovies] = useState<IAlertError | null>(
    null,
  );
  const [ratedPage, setRatedPage] = useState(1);

  const isRatedRef = useRef(false);

  interface ILoadMoviesProps {
    page?: string;
    searchValue?: string;
  }

  const theMovieDBApi = useContext(theMovieDBApiContext);

  function loadMovies({
    page = String(searchPage),
    searchValue = search,
  }: ILoadMoviesProps = {}) {
    setErrorLoad(null);
    setIsLoadingMovies(true);

    const queries: { [key: string]: string } = {
      query: searchValue,
      page,
    };

    theMovieDBApi
      .getSearchMovie(queries)
      .then(onLoadMovies)
      .catch((error) => {
        setErrorLoad({
          message: 'Error on loading',
          description: 'Failed to load movies',
          status: error.status,
        });
      })
      .finally(() => setIsLoadingMovies(false));
  }

  const debounceLoadMovies = useRef(debounce(loadMovies, 1500));

  function loadRatedMovies(page: number = ratedPage): void {
    function load() {
      setErrorRatedMovies(null);
      setIsLoadingRatedMovies(true);

      const id = LocalStorageService.getItem(
        ELocalStorageItem.GuestSessionId,
      ).id;

      const search: { [key: string]: string } = {
        page: String(page),
      };

      if (id) {
        theMovieDBApi
          .loadRatedMovies(id, search)
          .then(onLoadRatedMovies)
          .catch((error) => {
            setErrorRatedMovies({
              message: 'Error on loading',
              description: 'Failed to load rated movies',
              status: error.status,
            });
          })
          .finally(() => {
            setIsLoadingRatedMovies(false);
            updateStorageGuestSessionId(id);
          });
      }
    }

    if (isGuestSessionExpired()) {
      createGuestSession().then(load);
    } else {
      load();
    }
  }

  function changeStarsRatingRatedMovies(movieID: number, value: number) {
    const index = ratedMovies.findIndex((item) => item.id === movieID);
    setRatedMovies(
      ratedMovies.toSpliced(index, 1, {
        ...ratedMovies[index],
        rating: value,
      }),
    );

    const prevRatedMovies = LocalStorageService.getItem(
      ELocalStorageItem.RatedMovies,
    );

    const newData = prevRatedMovies
      ? [...JSON.parse(prevRatedMovies), [movieID, value]]
      : [[movieID, value]];

    LocalStorageService.setItem(
      ELocalStorageItem.RatedMovies,
      JSON.stringify(newData),
    );
  }

  const loadConfiguration = useCallback((): void => {
    theMovieDBApi.getConfiguration().then((data) => {
      setConfiguration(data);
    });
  }, [theMovieDBApi]);

  function updateStorageGuestSessionId(id: string) {
    LocalStorageService.setItem(ELocalStorageItem.GuestSessionId, {
      id,
      createdTime: Date.now(),
    });
  }

  function isGuestSessionExpired(): boolean {
    const guestSessionId = LocalStorageService.getItem(
      ELocalStorageItem.GuestSessionId,
    );

    return Boolean(
      !guestSessionId ||
        (guestSessionId &&
          (Date.now() - guestSessionId.createdTime) / 1000 / 60 > 60),
    );
  }

  const createGuestSession = useCallback(async (): Promise<void> => {
    if (isGuestSessionExpired()) {
      LocalStorageService.removeItem(ELocalStorageItem.RatedMovies);

      return theMovieDBApi.createGuestSession().then((data: IGuestSession) => {
        if (data.success) {
          updateStorageGuestSessionId(data.guest_session_id);
        }
      });
    }
  }, [theMovieDBApi]);

  const loadGenres = useCallback(() => {
    theMovieDBApi.getGenres().then(({ genres }) => {
      setGenres(genres);
    });
  }, [theMovieDBApi]);

  function reloadApp() {
    loadApp();
    loadMovies();
  }

  const loadApp = useCallback((): void => {
    loadConfiguration();
    createGuestSession();
    loadGenres();
  }, [loadConfiguration, createGuestSession, loadGenres]);

  useEffect(() => {
    loadApp();
  }, [loadApp]);

  useEffect(() => {
    const debounceLoadMoviesLink = debounceLoadMovies.current;

    return () => {
      debounceLoadMoviesLink.cancel();
    };
  }, []);

  function onLoadMovies({ results, page, total_results }: SearchMovie): void {
    setMovies(results);
    setPaginationMovies({ page, total: total_results });
  }

  function onLoadRatedMovies({
    results,
    page,
    total_results,
  }: IDataRatedMovie): void {
    setRatedMovies(results);
    setPaginationRatedMovies({ page, total: total_results });
  }

  function onSearch(searchValue: string): void {
    setSearch(searchValue);

    if (!searchValue) {
      setMovies([]);
      return;
    }

    setIsLoadingMovies(true);
    debounceLoadMovies.current({ searchValue: searchValue });
  }

  const onChangeSearchPage: TOnChangePageFunc = function (page: number) {
    setSearchPage(page);
    loadMovies({ page: String(page) });
  };

  const onChangeRatedPage: TOnChangePageFunc = function (page: number) {
    setRatedPage(page);
    loadRatedMovies(page);
  };

  function handleIsRated() {
    isRatedRef.current = true;
  }

  const mainClass = 'app';

  const onChangeTab = (key: string) => {
    if (key === ETabType.Rated) {
      loadRatedMovies();
    }
  };

  const items: TabsProps['items'] = [
    {
      key: ETabType.Search,
      label: 'Search',
      children: (
        <>
          <AppInput className="page-search" onInput={onSearch} value={search} />
          <GalleryMovies
            movies={movies}
            isLoading={isLoadingMovies}
            errorLoad={errorLoad}
            onError={reloadApp}
            imgBaseUrl={configuration?.images.secure_base_url}
            className={`${mainClass}__gallery-movies`}
            onEmptyRender={() => {
              if (!movies.length && search) {
                return 'Nothing was found';
              } else if (!movies.length && !search) {
                return 'Enter to search for movies';
              }
            }}
            paginationSettings={paginationMovies}
            onChangePage={onChangeSearchPage}
            changeStarsRatingRatedMovies={changeStarsRatingRatedMovies}
            handleIsRated={handleIsRated}
          />
        </>
      ),
    },
    {
      key: ETabType.Rated,
      label: 'Rated',
      children: (
        <ErrorBoundary>
          <GalleryMovies
            movies={ratedMovies}
            isLoading={isLoadingRatedMovies}
            errorLoad={
              !isRatedRef.current &&
              errorRatedMovies?.status === EStatusCode.NotFound
                ? null
                : errorRatedMovies
            }
            onError={loadRatedMovies}
            imgBaseUrl={configuration?.images.secure_base_url}
            className={`${mainClass}__gallery-movies`}
            onEmptyRender={() => {
              if (!ratedMovies.length) {
                return 'No rated movies';
              }
            }}
            paginationSettings={paginationRatedMovies}
            onChangePage={onChangeRatedPage}
            changeStarsRatingRatedMovies={changeStarsRatingRatedMovies}
            handleIsRated={handleIsRated}
          />
        </ErrorBoundary>
      ),
    },
  ];

  return (
    <div className="app">
      <theMovieDBApiContext.Provider value={theMovieDBApi}>
        <genresContext.Provider value={genres}>
          <main className="app__main">
            <Tabs
              defaultActiveKey="1"
              centered
              items={items}
              onChange={onChangeTab}
            />
          </main>
        </genresContext.Provider>
      </theMovieDBApiContext.Provider>
    </div>
  );
}
