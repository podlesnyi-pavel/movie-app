import './GalleryMovies.scss';
import MovieCard from '@components/MovieCard';
import IMovie, { IRatedMovie } from '@/types/theMovieDB/IMovie';
import Loader from '@components/Loader';
import { ELoader } from '../Loader/ELoader';
import IAlertError from '@/types/IAlertError';
import { Alert, Button } from 'antd';
import AppPagination from '../AppPagination';
import { IPaginationSettings } from '@/types/theMovieDB/enums/IPaginationSettings';
import { TOnChangePageFunc } from '@/types/TOnChangePageFunc';
import { TChangeStarsRatingRatedMovies } from '@/types/TChangeStarsRatingRatedMoviesFunc';
import LocalStorageService from '@/utils/LocalStorageService';
import { ELocalStorageItem } from '@/types/enums/ELocalStorageItem';

interface PropsGalleryMovies {
  movies: IMovie[] | IRatedMovie[];
  isLoading: boolean;
  errorLoad: IAlertError | null;
  imgBaseUrl: string | undefined;
  onError: () => void;
  className?: string;
  onEmptyRender: () =>
    | 'Nothing was found'
    | 'Enter to search for movies'
    | undefined
    | 'No rated movies';
  paginationSettings: IPaginationSettings | null;
  onChangePage: TOnChangePageFunc;
  changeStarsRatingRatedMovies: TChangeStarsRatingRatedMovies;
  handleIsRated: () => void;
}

export default function GalleryMovies({
  movies,
  isLoading,
  errorLoad,
  imgBaseUrl,
  onError,
  className = '',
  onEmptyRender,
  paginationSettings,
  onChangePage,
  changeStarsRatingRatedMovies,
  handleIsRated,
}: PropsGalleryMovies) {
  const mainClass = 'gallery-movies';
  let render;
  const emptyRender = onEmptyRender();

  if (isLoading) {
    render = <Loader size={ELoader.Large} />;
  } else if (errorLoad) {
    const { message, description, status } = errorLoad;

    render = (
      <Alert
        message={message}
        showIcon
        description={`${description} ${status}`}
        type="error"
        action={
          <Button size="small" danger onClick={onError}>
            Try again
          </Button>
        }
      />
    );
  } else if (emptyRender) {
    render = emptyRender;
  } else {
    const rated: Map<number, number> = new Map(
      JSON.parse(LocalStorageService.getItem(ELocalStorageItem.RatedMovies)),
    );

    const moviesList = movies.map((movie) => {
      const useKeyMovie = {
        id: movie.id,
        title: movie.title,
        voteAverage: movie.vote_average,
        releaseDate: movie.release_date,
        overview: movie.overview,
        posterPath: movie.poster_path,
        ownRating: 'rating' in movie ? movie.rating : rated.get(movie.id) || 0,
        genreIDs: movie.genre_ids,
      };
      return (
        <MovieCard
          key={movie.id}
          {...useKeyMovie}
          imgBaseUr={imgBaseUrl}
          changeStarsRatingRatedMovies={changeStarsRatingRatedMovies}
          handleIsRated={handleIsRated}
        />
      );
    });

    render = (
      <>
        {...moviesList}
        <AppPagination
          {...paginationSettings}
          onChangePage={onChangePage}
          className={`${mainClass}__app-pagination`}
        />
      </>
    );
  }

  return <div className={`${mainClass} ${className}`}>{render}</div>;
}
