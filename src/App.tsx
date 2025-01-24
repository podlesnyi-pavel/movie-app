import { useEffect, useState } from 'react';
import GalleryMovies from '@components/GalleryMovies';
import TheMovieDBApi from '@api/TheMovieDBApi';
import Movie from '~types/theMovieDB/Movie';
import IConfiguration from '~types/theMovieDB/IConfiguration';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [configuration, setConfiguration] = useState<IConfiguration | null>(
    null,
  );

  useEffect(() => {
    const theMovieDBApi = new TheMovieDBApi();

    theMovieDBApi.getSearchMovie().then((data) => {
      console.log(data);
      setMovies(data.results);
    });

    theMovieDBApi.getConfiguration().then((data) => {
      console.log(data);
      setConfiguration(data);
    });
  }, []);

  return (
    <div className="container">
      <GalleryMovies
        movies={movies}
        imgBaseUrl={configuration?.images.secure_base_url}
      />
    </div>
  );
}
