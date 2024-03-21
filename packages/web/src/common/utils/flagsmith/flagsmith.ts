import { FLAGSMITH_KEY } from '@/root/global-vars';
import flagsmith from 'flagsmith'; //Add this line if you're using flagsmith via npm

flagsmith.init({
  environmentID: FLAGSMITH_KEY,
  cacheFlags: true, // stores flags in localStorage cache
});

export default flagsmith;
