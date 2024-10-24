import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetectDevice from './index';

describe('DetectDevice component', () => {
  let userAgentGetter: jest.SpyInstance;
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    jest.useFakeTimers();
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  const mockWindowDimensions = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      value: width,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: height,
      configurable: true,
    });
    Object.defineProperty(window.screen, 'width', {
      value: width,
      configurable: true,
    });
    Object.defineProperty(window.screen, 'height', {
      value: height,
      configurable: true,
    });
  };

  it('renders component with correct title', () => {
    render(<DetectDevice />);
    const titleElement = screen.getByText('Device Detection');
    expect(titleElement).toBeInTheDocument();
  });

  it('initially displays desktop as default device type', () => {
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
    );
    mockWindowDimensions(1920, 1080);

    render(<DetectDevice />);
    const deviceTypeElement = screen.getByText('This device is detected as: desktop');
    expect(deviceTypeElement).toBeInTheDocument();
  });

  it('updates device type after initial render', async () => {
    render(<DetectDevice />);

    await act(async () => {
      jest.runAllTimers();
    });

    const deviceTypeElement = screen.getByText(/This device is detected as:/);
    expect(deviceTypeElement).toBeInTheDocument();
  });

  it('re-renders on window resize', async () => {
    // Mock initial desktop environment
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
    );
    mockWindowDimensions(1920, 1080);
    Object.defineProperty(window, 'ontouchstart', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([]),
      },
      configurable: true,
    });

    render(<DetectDevice />);

    await act(async () => {
      jest.runAllTimers();
    });

    const initialDeviceType = screen.getByText(/This device is detected as:/).textContent;
    console.log('Initial device type:', initialDeviceType);

    // Mock tablet environment
    mockWindowDimensions(800, 1024);
    Object.defineProperty(window, 'ontouchstart', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    );
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(orientation: portrait)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([{ kind: 'videoinput' }]),
      },
      configurable: true,
    });

    await act(async () => {
      fireEvent(window, new Event('resize'));
      jest.runAllTimers();
    });

    const updatedDeviceType = screen.getByText(/This device is detected as:/).textContent;
    console.log('Updated device type:', updatedDeviceType);

    expect(updatedDeviceType).not.toBe(initialDeviceType);
  });

  it('detects a phone device', async () => {
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    );
    mockWindowDimensions(375, 667);
    Object.defineProperty(window, 'ontouchstart', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(orientation: portrait)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([{ kind: 'videoinput' }]),
      },
      configurable: true,
    });

    console.log(
      'Before render - innerWidth:',
      window.innerWidth,
      'innerHeight:',
      window.innerHeight,
    );
    console.log('Before render - userAgent:', navigator.userAgent);

    render(<DetectDevice />);

    await act(async () => {
      jest.runAllTimers();
    });

    const deviceTypeElement = screen.getByText(/This device is detected as:/);
    console.log('Detected device type:', deviceTypeElement.textContent);

    expect(deviceTypeElement).toHaveTextContent('phone');
  });
});
