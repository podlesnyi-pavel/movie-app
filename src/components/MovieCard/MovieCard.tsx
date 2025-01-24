import { Rate } from 'antd';
import './MovieCard.scss';
import Genre from '@components/Genre';
import { format } from 'date-fns';
import truncateEllipsisString from '@/utils/truncateEllipsisString';
import variables from '@styles/modules/_variables.module.scss';
import { EPosterSizes } from '@/types/theMovieDB/enums/EPosterSizes';
import { ELengthDescription } from './ELengthDescription';

interface PropsMovieCard {
  posterPath: string;
  title: string;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  imgBaseUr: string | undefined;
}

export default function MovieCard({
  title,
  voteAverage,
  releaseDate,
  overview,
  posterPath,
  imgBaseUr,
}: PropsMovieCard) {
  const urlPoster = posterPath
    ? `${imgBaseUr}/${EPosterSizes.W500}${posterPath}`
    : 'src/assets/empty-poster.jpg';

  const date = releaseDate
    ? format(new Date(releaseDate), 'MMMM dd, yyyy')
    : '';

  const rating = voteAverage.toFixed(1);
  const lengthDescription =
    window.innerWidth >= parseInt(variables.sizeTabletScreen)
      ? ELengthDescription.Desktop
      : ELengthDescription.Mobile;

  const description = truncateEllipsisString(overview, lengthDescription);

  return (
    <article className="movie-card">
      <img src={urlPoster} alt="movie" className="movie-card__image" />

      <div className="movie-card__header">
        <h3 className="movie-card__title" title={title}>
          {title}
        </h3>
        <div className="movie-card__rating">{rating}</div>
      </div>

      <div className="movie-card__date">{date}</div>

      <div className="movie-card__genres">
        <Genre>Action</Genre>
        <Genre>Drama</Genre>
      </div>

      <div className="movie-card__description">{description}</div>

      <Rate
        className="movie-card__stars"
        allowHalf
        defaultValue={voteAverage}
        value={voteAverage}
        count={10}
      />
    </article>
  );
}
