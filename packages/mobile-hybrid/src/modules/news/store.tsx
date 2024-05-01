import { NewsModel } from '@/models/news';
import { atom } from 'jotai';

export const newsPanelStore = atom<boolean>(false);
export const newsStore = atom<NewsModel[]>([]);
