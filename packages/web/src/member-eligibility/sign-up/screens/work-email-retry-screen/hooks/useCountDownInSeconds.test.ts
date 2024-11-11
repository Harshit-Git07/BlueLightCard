import { renderHook, act } from '@testing-library/react';
import { useCountDownInSeconds } from './UseCountDownInSecs';

jest.useFakeTimers();

describe('useCountDownInSeconds', () => {
  const initialCountDownInSecs = 10;

  it('should initialize with the given countdown value', () => {
    const { result } = renderHook(() => useCountDownInSeconds(initialCountDownInSecs));
    expect(result.current.formattedTime).toBe('0:10');
    expect(result.current.countDownFinished).toBe(false);
  });

  it('should decrement the countdown every second', () => {
    const { result } = renderHook(() => useCountDownInSeconds(initialCountDownInSecs));

    act(() => {
      jest.advanceTimersByTime(3000); // Advance by 3 seconds
    });

    expect(result.current.formattedTime).toBe('0:07');
    expect(result.current.countDownFinished).toBe(false);
  });

  it('should stop at 0 and set countDownFinished to true', () => {
    const { result } = renderHook(() => useCountDownInSeconds(2));

    act(() => {
      jest.advanceTimersByTime(3000); // Advance by 3 seconds
    });

    expect(result.current.formattedTime).toBe('0:00');
    expect(result.current.countDownFinished).toBe(true);
  });

  it('should reset the countdown when resetCountDown is called', () => {
    const { result } = renderHook(() => useCountDownInSeconds(initialCountDownInSecs));

    act(() => {
      jest.advanceTimersByTime(5000); // Advance by 5 seconds
      result.current.resetCountDown();
    });

    expect(result.current.formattedTime).toBe('0:10');
    expect(result.current.countDownFinished).toBe(false);
  });

  it('should restart the countdown when restartTimer is called', () => {
    const { result } = renderHook(() => useCountDownInSeconds(initialCountDownInSecs));

    act(() => {
      jest.advanceTimersByTime(5000); // Advance by 5 seconds
      result.current.restartTimer();
    });

    expect(result.current.formattedTime).toBe('0:10');
    expect(result.current.countDownFinished).toBe(false);
  });
});
