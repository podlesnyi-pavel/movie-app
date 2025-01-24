import './GalleryMovies.scss';
import MovieCard from '@components/MovieCard';
import Movie from '~types/theMovieDB/Movie';

interface PropsGalleryMovies {
  movies: Movie[];
  imgBaseUrl: string | undefined;
}

export default function GalleryMovies({
  movies,
  imgBaseUrl,
}: PropsGalleryMovies) {
  return (
    <div className="gallery-movies">
      {movies.map((movie) => {
        const useKeyMovie = {
          title: movie.title,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          overview: movie.overview,
          poster_path: movie.poster_path,
        };
        return (
          <MovieCard key={movie.id} {...useKeyMovie} imgBaseUr={imgBaseUrl} />
        );
      })}
    </div>
  );
}
