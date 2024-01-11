export interface Message {
  message: any;
  timestamp: number;
}

export interface MessageAPIResponse<R> {
  url: string;
  response: R;
}
