import { atom } from 'jotai';
import { SearchQuery, SearchResults } from './types';

// store search results
export const searchResults = atom<SearchResults>([]);

// store search term
export const searchTerm = atom<string | undefined>(undefined);
