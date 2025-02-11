import { IRatedMovie } from '@/types/theMovieDB/IMovie';

export default interface IDataRatedMovie {
  page: number;
  results: IRatedMovie[];
  total_pages: number;
  total_results: number;
}
