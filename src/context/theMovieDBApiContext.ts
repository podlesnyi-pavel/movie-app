import { createContext } from 'react';
import TheMovieDBApi from '@api/TheMovieDBApi';

export const theMovieDBApiContext = createContext(new TheMovieDBApi());
