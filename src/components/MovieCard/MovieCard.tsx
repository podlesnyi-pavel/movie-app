import { Rate } from 'antd';
import './MovieCard.scss';
import Genre from '@components/Genre';
import { format } from 'date-fns';
import truncateEllipsisString from '@/utils/truncateEllipsisString';
import variables from '@styles/modules/_variables.module.scss';
import { EPosterSizes } from '@/types/theMovieDB/enums/EPosterSizes';
import { ELengthDescription } from './ELengthDescription';
import { useContext } from 'react';
import { theMovieDBApiContext } from '@/context/theMovieDBApiContext';
import { genresContext } from '@/context/genresContext';
import LocalStorageService from '@/utils/LocalStorageService';
import { ELocalStorageItem } from '@/types/enums/ELocalStorageItem';
import { TChangeStarsRatingRatedMovies } from '@/types/TChangeStarsRatingRatedMoviesFunc';

import posterImgSrc from '@/assets/empty-poster.jpg';

interface PropsMovieCard {
  id: number;
  title: string;
  voteAverage: number;
  releaseDate: string;
  overview: string | undefined;
  posterPath: string;
  imgBaseUr: string | undefined;
  ownRating: number;
  genreIDs: number[];
  changeStarsRatingRatedMovies: TChangeStarsRatingRatedMovies;
  handleIsRated: () => void;
}

export default function MovieCard({
  id,
  title,
  voteAverage,
  releaseDate,
  overview,
  posterPath,
  imgBaseUr,
  ownRating,
  genreIDs,
  changeStarsRatingRatedMovies,
  handleIsRated,
}: PropsMovieCard) {
  const theMovieDBApi = useContext(theMovieDBApiContext);
  const genres = useContext(genresContext);

  function onAddRating(rating: number) {
    const guestSessionId = LocalStorageService.getItem(
      ELocalStorageItem.GuestSessionId,
    ).id;

    if (guestSessionId) {
      theMovieDBApi.addRating(rating, id, guestSessionId).then(() => {
        changeStarsRatingRatedMovies(id, rating);
        handleIsRated();
      });
    }
  }

  const urlPoster = posterPath
    ? `${imgBaseUr}/${EPosterSizes.W500}${posterPath}`
    : posterImgSrc;

  const date = releaseDate
    ? format(new Date(releaseDate), 'MMMM dd, yyyy')
    : '';

  const rating = voteAverage ? voteAverage.toFixed(1) : 0;
  const lengthDescription =
    window.innerWidth >= parseInt(variables.sizeTabletScreen)
      ? ELengthDescription.Desktop
      : ELengthDescription.Mobile;

  const description = overview
    ? truncateEllipsisString(overview, lengthDescription)
    : '';

  const styleRating = { borderColor: 'transparent' };

  if (voteAverage > 7) {
    styleRating.borderColor = '#66E900';
  } else if (voteAverage > 5) {
    styleRating.borderColor = '#E9D100';
  } else if (voteAverage > 3) {
    styleRating.borderColor = '#E97E00';
  } else {
    styleRating.borderColor = '#E90000';
  }

  return (
    <article className="movie-card">
      <a className="movie-card__wrap-image" href="#">
        <img src={urlPoster} alt="movie" className="movie-card__image" />
      </a>

      <div className="movie-card__header">
        <h3 className="movie-card__title" title={title}>
          <a href="#">{title}</a>
        </h3>
        <div className="movie-card__rating" style={styleRating}>
          {rating}
        </div>
      </div>

      <div className="movie-card__date">{date}</div>

      <div className="movie-card__genres">
        {genreIDs.map((genreId) => {
          const genre = genres.find((item) => item.id === genreId);

          return <Genre key={genre?.id}>{genre!.name}</Genre>;
        })}
      </div>

      <div className="movie-card__description">{description}</div>

      <Rate
        className="movie-card__stars"
        allowHalf
        defaultValue={0}
        value={ownRating}
        count={10}
        onChange={onAddRating}
      />
    </article>
  );
}
