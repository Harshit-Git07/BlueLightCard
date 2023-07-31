const trackScrollDepth = (rootElement: HTMLElement, callback: (depth: number) => void) => {
  let triggerDepth: number | null = null;

  window.addEventListener('scroll', () => {
    const scrollHeight = rootElement.scrollHeight - window.innerHeight;
    const scrollY = (window.scrollY / scrollHeight) * 100;
    if (scrollY >= 0 && scrollY < 25 && triggerDepth !== 0) {
      triggerDepth = 0;
      callback(0);
    } else if (scrollY >= 25 && scrollY < 50 && triggerDepth !== 25) {
      triggerDepth = 25;
      callback(25);
    } else if (scrollY >= 50 && scrollY < 75 && triggerDepth !== 50) {
      triggerDepth = 50;
      callback(50);
    } else if (scrollY >= 75 && scrollY < 100 && triggerDepth !== 75) {
      triggerDepth = 75;
      callback(75);
    } else if (scrollY === 100 && triggerDepth !== 100) {
      triggerDepth = 100;
      callback(100);
    }
  });
};

export default trackScrollDepth;
