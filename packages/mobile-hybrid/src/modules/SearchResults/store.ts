import { atom } from 'jotai';
import { SearchResults } from './types';

// store search results
export const searchResults = atom<SearchResults>([]);

// store search term
export const searchTerm = atom<string | undefined>(undefined);
