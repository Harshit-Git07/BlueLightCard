import { FC, createContext, useState, PropsWithChildren } from 'react';

interface Store {
  seeAllNews: boolean;
  setSeeAllNews: (seeAll: boolean) => void;
}

export const NewsModuleStore = createContext<Store>({
  seeAllNews: false,
  setSeeAllNews() {},
});

export const NewsStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [seeAllNews, setSeeAllNews] = useState(false);
  return (
    <NewsModuleStore.Provider value={{ seeAllNews, setSeeAllNews }}>
      {children}
    </NewsModuleStore.Provider>
  );
};
