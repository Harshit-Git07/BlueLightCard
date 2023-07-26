export interface AppContextStructure {
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
  state: ActionApiData;
}