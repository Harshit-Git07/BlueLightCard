import React from 'react';
import { Amplitude } from '@/utils/amplitude/amplitude';

const AmplitudeContext = React.createContext<Amplitude | null | undefined>(new Amplitude());

export default AmplitudeContext;
