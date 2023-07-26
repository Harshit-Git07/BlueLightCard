import { createContext, FC, useEffect, Reducer, useReducer, PropsWithChildren } from 'react';
import Observable from '@/observable';
import { AppContextStructure, DispatchActionData } from './types';

const initialState: AppContextStructure = {
  apiData: {},
};

export const AppContext = createContext<AppContextStructure>(initialState);

const storeReducer: Reducer<AppContextStructure, DispatchActionData> = (state, action) => {
  switch (action.type) {
    case 'setAPIData': {
      return {
        apiData: {
          ...state.apiData,
          [action.state.url]: action.state.data,
        }
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
        }
      });
    });
  }, []);
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};