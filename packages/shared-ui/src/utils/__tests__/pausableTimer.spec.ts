import { createTimer } from '../pausableTimer';
import { waitFor } from '@testing-library/react';

describe('pausableTimer', () => {
  it('should provide an object with methods and props', () => {
    const spy = jest.fn();
    const timer = createTimer(spy, 1000);
    expect(timer).toHaveProperty('pause', expect.any(Function));
    expect(timer).toHaveProperty('resume', expect.any(Function));
    expect(timer).toHaveProperty('getRemaining', expect.any(Function));
    expect(timer).toHaveProperty('getTimerId', expect.any(Function));
    expect(timer).toHaveProperty('start', expect.any(Number));
    clearTimeout(timer.getTimerId());
  });

  it('should clear the timeout when paused', () => {
    const spy = jest.fn();
    const timer = createTimer(spy, 1000);
    expect(timer.getTimerId()).toBeDefined();
    expect(timer.pause()).toEqual(expect.any(Number));
    expect(timer.getTimerId()).not.toBeDefined();
  });

  it('should start the timeout again when resume is called', () => {
    const spy = jest.fn();
    const timer = createTimer(spy, 1000);
    timer.pause();
    expect(timer.getTimerId()).not.toBeDefined();
    expect(timer.resume()).toEqual(expect.any(Number));
    expect(timer.getTimerId()).toBeDefined();
    clearTimeout(timer.getTimerId());
  });

  it('should call a callback when the timeout is met', async () => {
    const spy = jest.fn();
    const timer = createTimer(spy, 50);
    await waitFor(async () => {
      expect(spy).toHaveBeenCalled();
    });
    expect(timer.getTimerId()).not.toBeDefined();
  });

  it('should get the remaining time', () => {
    const spy = jest.fn();
    const timer = createTimer(spy, 100);
    timer.pause();
    const rem = timer.getRemaining();
    expect(rem).toBeGreaterThan(0);
    expect(rem).toBeLessThan(100000);
  });
});
