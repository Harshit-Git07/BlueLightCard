// Local storage mock
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: any) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

export {};
