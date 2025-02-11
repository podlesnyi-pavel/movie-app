import Movie from '@/types/theMovieDB/IMovie';

export default interface SearchMovie {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
