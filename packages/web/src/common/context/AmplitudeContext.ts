import React from 'react';
import type { Amplitude } from '@/utils/amplitude/amplitude';

const AmplitudeContext = React.createContext<Amplitude | null | undefined>(null);

export default AmplitudeContext;
