import Autoplay from 'embla-carousel-autoplay';

export const RandomAutoplay = () => {
  const randomDelay = () => Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
  return Autoplay({ delay: randomDelay() });
};
