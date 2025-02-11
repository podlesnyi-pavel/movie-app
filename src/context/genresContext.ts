import { IGenre } from '@/types/theMovieDB/IGenre';
import { createContext } from 'react';

export const genresContext = createContext<IGenre[]>([]);
