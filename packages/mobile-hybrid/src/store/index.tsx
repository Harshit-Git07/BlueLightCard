import { createContext, FC, useEffect, Reducer, useReducer, PropsWithChildren } from 'react';
import { useSetAtom } from 'jotai';
import { AppContextStructure, AppStore, DispatchActionData } from './types';
import { APIUrl, Channels } from '@/globals';
import { spinner } from '@/modules/Spinner/store';
import eventBus from '@/eventBus';

const initialState: AppStore = {
  loading: {
    [APIUrl.News]: true,
    [APIUrl.OfferPromos]: true,
    [APIUrl.FavouritedBrands]: true,
    [APIUrl.UserService]: true,
  },
  apiData: {},
  experiments: {},
  dispatch() {},
};

export const AppContext = createContext<AppStore>(initialState);

const storeReducer: Reducer<AppContextStructure, DispatchActionData> = (state, action) => {
  switch (action.type) {
    case 'setAPIData': {
      return {
        ...state,
        apiData: {
          ...state.apiData,
          [action.state.url]: action.state.data,
        },
      };
    }
    case 'setLoading': {
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.state.key]: action.state.loading,
        },
      };
    }
    case 'setExperiment': {
      return {
        ...state,
        experiments: action.state,
      };
    }
  }
  throw Error(`Unknown action: ${action.type}`);
};

export const AppStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const setSpinner = useSetAtom(spinner);

  // MIGRATION - migrating over to the use of atoms, by setting the loading state on the new spinner
  useEffect(() => {
    const initialApiCalls = [APIUrl.News, APIUrl.OfferPromos, APIUrl.FavouritedBrands];
    const hasFinishedLoading = (apiCalls: string[]): boolean => {
      return !apiCalls.map((apiCall) => state.loading[apiCall].valueOf()).includes(true);
    };

    if (hasFinishedLoading(initialApiCalls)) {
      setSpinner(false);
    }
  }, [setSpinner, state.loading]);

  useEffect(() => {
    eventBus.on(Channels.API_RESPONSE, (path, data) => {
      dispatch({
        type: 'setAPIData',
        state: {
          url: path,
          data,
        },
      });
      dispatch({
        type: 'setLoading',
        state: {
          key: path,
          loading: false,
        },
      });
    });
    eventBus.on(Channels.EXPERIMENTS, (experiments) => {
      dispatch({
        type: 'setExperiment',
        state: experiments,
      });
    });
  }, []);
  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
};
