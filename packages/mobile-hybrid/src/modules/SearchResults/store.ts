import { atom } from 'jotai';
import { SearchResultsWrapper } from './types';

// store search results
export const searchResults = atom<SearchResultsWrapper>({ results: [], term: undefined });

// store search term
export const searchTerm = atom<string | undefined>(undefined);
