import { useEffect, useState } from 'react';
import GalleryMovies from '@components/GalleryMovies';
import TheMovieDBApi from '@api/TheMovieDBApi';
import Movie from '~types/theMovieDB/Movie';
import IConfiguration from '~types/theMovieDB/IConfiguration';
import SearchMovie from '~types/theMovieDB/SearchMovie';
import IAlertError from '~types/IAlertError';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [configuration, setConfiguration] = useState<IConfiguration | null>(
    null,
  );
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [errorLoad, setErrorLoad] = useState<IAlertError | null>(null);

  useEffect(() => {
    loadApp();
  }, []);

  function loadMovies() {
    resetErrorLoad();
    const theMovieDBApi = new TheMovieDBApi();

    setIsLoadingMovies(true);

    theMovieDBApi
      .getSearchMovie()
      .then(onLoadMovies)
      .catch((error) => {
        console.log(error);
        setErrorLoad({
          message: 'Error on loading',
          description: 'Failed to load movies',
        });
      })
      .finally(() => setIsLoadingMovies(false));
  }

  function loadConfiguration() {
    const theMovieDBApi = new TheMovieDBApi();

    theMovieDBApi.getConfiguration().then((data) => {
      console.log(data);
      setConfiguration(data);
    });
  }

  function loadApp(): void {
    loadMovies();
    loadConfiguration();
  }

  function onLoadMovies(data: SearchMovie) {
    console.log(data);
    setMovies(data.results);
  }

  function resetErrorLoad() {
    setErrorLoad(null);
  }

  return (
    <div className="container">
      <GalleryMovies
        movies={movies}
        isLoadingMovies={isLoadingMovies}
        errorLoad={errorLoad}
        loadApp={loadApp}
        imgBaseUrl={configuration?.images.secure_base_url}
      />
    </div>
  );
}
