import { useRef, useState } from 'react';

// allows you to setState but also immediately read the state back again without waiting for a re-render
const useStateSync = <T>(defaultValue: T): [T, (newValue: T) => void, () => T] => {
  const [value, setValue] = useState<T>(defaultValue);
  const ref = useRef<T>(defaultValue);

  const setNewValue = (newValue: T) => {
    ref.current = newValue;

    // triggers a re-render of the component using this hook
    setValue(newValue);
  };

  const getCurrent = (): T => ref.current;

  return [value, setNewValue, getCurrent];
};

export default useStateSync;
