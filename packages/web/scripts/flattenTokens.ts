import { cloneDeep } from 'lodash';
import { TransformedTokens } from 'style-dictionary';

/**
 * Flattens style dictionary transformed tokens from 'key': { 'value': '' } to 'key': ''
 * @param tokens
 * @returns {Object}
 */
const flattenTokens = (tokens: TransformedTokens) => {
  const copy = cloneDeep(tokens);

  const recurse = (object: TransformedTokens) => {
    for (const key in object) {
      if (typeof object[key] === 'object' && !object[key].value) {
        recurse(object[key]);
      } else if (typeof object[key] === 'object' && object[key].value) {
        object[key] = object[key].value;
      }
    }
  };

  recurse(copy);
  return copy;
};

export default flattenTokens;
