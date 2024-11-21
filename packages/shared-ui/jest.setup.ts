import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

const mockGetDocument = jest.fn().mockResolvedValue('Success');
jest.mock('pdfjs-dist/webpack.mjs', () => ({
  getDocument: () => ({ promise: mockGetDocument() }),
}));

Object.defineProperty(File.prototype, 'arrayBuffer', {
  value: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  writable: true,
});
