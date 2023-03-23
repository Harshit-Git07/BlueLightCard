import { createContext } from 'react';
import { PageJourneyContextData } from './types';

const PageJourneyContext = createContext<PageJourneyContextData>({});

export default PageJourneyContext;
