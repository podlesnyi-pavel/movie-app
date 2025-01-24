import { Rate } from 'antd';
import './MovieCard.scss';
import Genre from '@components/Genre';
import { format } from 'date-fns';
import truncateEllipsisString from '@/utils/truncateEllipsisString';
import variables from '@styles/modules/_variables.module.scss';

interface PropsMovieCard {
  poster_path: string;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  imgBaseUr: string | undefined;
}

export default function MovieCard({
  title,
  vote_average,
  release_date,
  overview,
  poster_path,
  imgBaseUr,
}: PropsMovieCard) {
  const posterSize = 'w500'; // заменить на enum

  const urlPoster = poster_path
    ? `${imgBaseUr}/${posterSize}${poster_path}`
    : 'src/assets/empty-poster.jpg';

  const date = release_date
    ? format(new Date(release_date), 'MMMM dd, yyyy')
    : '';

  const rating = vote_average.toFixed(1);
  const lengthDescription =
    window.innerWidth >= parseInt(variables.sizeTabletScreen) ? 145 : 180;

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
        defaultValue={vote_average}
        count={10}
      />
    </article>
  );
}
