export interface TrendingSearchesProps {
  trendingSearches: SearchTerms[];
  onTermClick: (data: string) => void;
}

export interface SearchTerms {
  id: number;
  text: string;
}
