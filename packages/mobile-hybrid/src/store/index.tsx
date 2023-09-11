import { createContext, FC, useEffect, Reducer, useReducer, PropsWithChildren } from 'react';
import Observable from '@/observable';
import { AppContextStructure, AppStore, DispatchActionData } from './types';
import { APIUrl } from '@/hooks/useAPIData';
import { th } from 'date-fns/locale';

const initialState: AppStore = {
  loading: {
    [APIUrl.News]: true,
    [APIUrl.OfferPromos]: true,
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
  useEffect(() => {
    Observable.getInstance().subscribe('nativeAPIResponse', (data: any) => {
      dispatch({
        type: 'setAPIData',
        state: {
          url: data.url,
          data: data.response,
        },
      });
      dispatch({
        type: 'setLoading',
        state: {
          key: data.url,
          loading: false,
        },
      });
    });
    Observable.getInstance().subscribe('nativeExperiments', (data: any) => {
      dispatch({
        type: 'setExperiment',
        state: data,
      });
    });
  }, []);
  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
};
