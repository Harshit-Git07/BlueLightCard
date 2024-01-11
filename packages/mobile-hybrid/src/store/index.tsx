import { createContext, FC, useEffect, Reducer, useReducer, PropsWithChildren } from 'react';
import { useSetAtom } from 'jotai';
import { AppContextStructure, AppStore, DispatchActionData } from './types';
import { APIUrl, Channels, eventBus } from '@/globals';
import { spinner } from '@/modules/Spinner/store';

const initialState: AppStore = {
  loading: {
    [APIUrl.News]: true,
    [APIUrl.OfferPromos]: true,
    [APIUrl.FavouritedBrands]: true,
  },
  apiData: {},
  experiments: '',
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

  useEffect(() => {
    eventBus.on(Channels.API_RESPONSE, () => {
      const latest = eventBus.getLatestMessage(Channels.API_RESPONSE);
      const message = latest!.message;
      dispatch({
        type: 'setAPIData',
        state: {
          url: message.url,
          data: message.response,
        },
      });
      dispatch({
        type: 'setLoading',
        state: {
          key: message.url,
          loading: false,
        },
      });
      // MIGRATION - migrating over to the use of atoms, by setting the loading state on the new spinner
      setSpinner(!!Object.values(state.loading).filter((loading) => !loading).length);
    });
    eventBus.on(Channels.EXPERIMENTS, () => {
      const latest = eventBus.getLatestMessage(Channels.EXPERIMENTS);
      const message = latest!.message;
      dispatch({
        type: 'setExperiment',
        state: message,
      });
    });
  }, [setSpinner]);
  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
};
