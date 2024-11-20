import { ChangeEventHandler, KeyboardEventHandler, FC, useState } from 'react';
import { IS_SSR } from '@/globals';

const DevTools: FC = () => {
  const currentUrl = IS_SSR ? '' : window.location.href;
  const [devUrl, setDevUrl] = useState(currentUrl);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setDevUrl(event.target.value);
  };

  const onSubmit: KeyboardEventHandler = (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    window.location.href = devUrl;
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      <label htmlFor="devURLInput">Dev URL </label>

      <input
        id="devURLInput"
        placeholder="Dev URL"
        onChange={onInputChange}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        onKeyDown={onSubmit}
        defaultValue={devUrl}
        autoCapitalize="off"
        spellCheck="false"
        pattern="^(http|https):\/\/(.*).pages.dev/"
        className="text-ellipsis px-6 py-3 rounded-full w-full overflow-x-hidden bg-searchBar-bg-colour-light dark:bg-searchBar-bg-colour-dark border-searchBar-outline-colour-light border text-searchBar-label-colour-light dark:text-searchBar-label-colour-dark dark:border-searchBar-outline-colour-dark focus:outline-none font-searchBar-label-font text-searchBar-label-font font-searchBar-label-font-weight tracking-searchBar-label-font leading-searchBar-label-font"
      />
    </div>
  );
};

export default DevTools;
