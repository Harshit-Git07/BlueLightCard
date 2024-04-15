const getDeviceFingerprint = () => {
  return (
    (typeof window !== 'undefined' &&
      window.localStorage &&
      window.localStorage.getItem('deviceFingerprint')) ||
    ''
  );
};

export default getDeviceFingerprint;
