import { CharacterEntities } from '../constants';

// used to identity if element already exists, so we don't recreate it every time
const decodeEntitiesElementId = 'decode-entities-element';

const decodeCharEntities = (text: string) => {
  let _text = text;
  Object.keys(CharacterEntities).forEach((char) => {
    _text = _text.replaceAll(char, CharacterEntities[char]);
  });
  return _text;
};

/**
 * Decodes html entities
 * @param html
 * @returns
 */
const decodeEntities = (html: string) => {
  let textAreaElement = document.getElementById(decodeEntitiesElementId) as HTMLTextAreaElement;
  if (!textAreaElement) {
    textAreaElement = document.createElement('textarea');
    textAreaElement.id = decodeEntitiesElementId;
    textAreaElement.style.display = 'none';
  }
  textAreaElement.innerHTML = decodeCharEntities(html);
  return textAreaElement.value;
};

export default decodeEntities;
