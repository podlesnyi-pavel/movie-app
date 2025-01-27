import './GalleryMovies.scss';
import MovieCard from '@components/MovieCard';
import Movie from '~types/theMovieDB/Movie';
import Loader from '@components/Loader';
import { ELoader } from '../Loader/ELoader';
import IAlertError from '~types/IAlertError';
import { Alert, Button } from 'antd';
import AppPagination from '../AppPagination';
import { IPaginationSettings } from '~types/theMovieDB/enums/IPaginationSettings';
import { TOnChangeCurrentPageFunc } from '~types/TOnChangeCurrentPageFunc';

interface PropsGalleryMovies {
  movies: Movie[];
  isLoadingMovies: boolean;
  errorLoad: IAlertError | null;
  imgBaseUrl: string | undefined;
  loadApp: () => void;
  className?: string;
  inputSearchValue: string;
  paginationSettings: IPaginationSettings | null;
  onChangeCurrentPage: TOnChangeCurrentPageFunc;
}

export default function GalleryMovies({
  movies,
  isLoadingMovies,
  errorLoad,
  imgBaseUrl,
  loadApp,
  className = '',
  inputSearchValue = '',
  paginationSettings,
  onChangeCurrentPage,
}: PropsGalleryMovies) {
  const mainClass = 'gallery-movies';
  const isEmptyMovies = !movies.length;
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
  } else if (isEmptyMovies && inputSearchValue) {
    render = 'Nothing was found';
  } else if (isEmptyMovies && !inputSearchValue) {
    render = 'Enter to search for movies';
  } else {
    const moviesList = movies.map((movie) => {
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

    render = (
      <>
        {...moviesList}
        <AppPagination
          {...paginationSettings}
          onChangeCurrentPage={onChangeCurrentPage}
          className={`${mainClass}__app-pagination`}
        />
      </>
    );
  }

  return <div className={`${mainClass} ${className}`}>{render}</div>;
}
