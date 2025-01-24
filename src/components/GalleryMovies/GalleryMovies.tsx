import './GalleryMovies.scss';
import MovieCard from '@components/MovieCard';
import Movie from '~types/theMovieDB/Movie';
import Loader from '@components/Loader';
import { ELoader } from '../Loader/ELoader';
import IAlertError from '~types/IAlertError';
import { Alert, Button } from 'antd';

interface PropsGalleryMovies {
  movies: Movie[];
  isLoadingMovies: boolean;
  errorLoad: IAlertError | null;
  imgBaseUrl: string | undefined;
  loadApp: () => void;
}

export default function GalleryMovies({
  movies,
  isLoadingMovies,
  errorLoad,
  imgBaseUrl,
  loadApp,
}: PropsGalleryMovies) {
  let render;

  if (isLoadingMovies) {
    render = <Loader size={ELoader.Large} />;
  } else if (errorLoad) {
    const { message, description } = errorLoad;

    render = (
      <Alert
        message={message}
        showIcon
        description={description}
        type="error"
        action={
          <Button size="small" danger onClick={loadApp}>
            Try again
          </Button>
        }
      />
    );
  } else {
    render = movies.map((movie) => {
      const useKeyMovie = {
        title: movie.title,
        voteAverage: movie.vote_average,
        releaseDate: movie.release_date,
        overview: movie.overview,
        posterPath: movie.poster_path,
      };
      return (
        <MovieCard key={movie.id} {...useKeyMovie} imgBaseUr={imgBaseUrl} />
      );
    });
  }

  return <div className="gallery-movies">{render}</div>;
}
