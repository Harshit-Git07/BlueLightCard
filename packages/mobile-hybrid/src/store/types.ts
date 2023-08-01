import type { Dispatch } from 'react';

export interface AppContextStructure {
  loading: boolean;
  apiData: {
    [url: string]: any;
  };
}

export interface ActionApiData {
  url: string;
  data: any;
}

export interface DispatchActionData {
  type: string;
  state: any;
}

export type AppStore = AppContextStructure & {
  dispatch: Dispatch<DispatchActionData>;
};
