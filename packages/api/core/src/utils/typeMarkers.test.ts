import { describe, expect } from '@jest/globals';
import { assert, Equals } from 'tsafe/assert';

import { createMarkedType, InferMarkedType, mark } from './typeMarkers';

describe('mark', () => {
  it('should not alter the object', () => {
    // Arrange
    type MyType = { foo: string };
    const value = { foo: 'bar' };

    // Act
    const result = mark<MyType, 'MARKER'>(value);

    // Assert
    expect(result).toBe(value);
    expect(result).toStrictEqual({ foo: 'bar' });
  });

  it('should be marked', () => {
    // Arrange
    type MyType = { foo: string };
    const value = { foo: 'bar' };

    // Act
    const result = mark<MyType, 'MARKER'>(value);

    // Assert
    expect(result.__marker).toBe(undefined);
    assert<Equals<'MARKER' | undefined, typeof result.__marker>>();
  });
});

describe('createMarkedType', () => {
  it('should create a marked type', () => {
    // Arrange
    const MarkedType = createMarkedType<string, 'MARKER'>();
    type MarkedType = InferMarkedType<typeof MarkedType>;

    // Act
    const result = MarkedType.of('foo');

    // Assert
    expect(result).toBe('foo');
    assert<Equals<'MARKER' | undefined, typeof result.__marker>>();
  });

  it('should reject incorrect values', () => {
    // Arrange
    const MarkedType = createMarkedType<string, 'MARKER'>();
    type MarkedType = InferMarkedType<typeof MarkedType>;

    // Assert
    // @ts-expect-error - should only accept strings
    MarkedType.of(42);
  });

  it('should correctly infer the marker type', () => {
    // Arrange
    const MarkedType = createMarkedType<string, 'MARKER'>();
    type MarkedType = InferMarkedType<typeof MarkedType>;

    // Assert
    // @ts-expect-error - unmarked types should not be assignable to marked types
    'foo' satisfies MarkedType;
    MarkedType.of('foo') satisfies MarkedType;
  });
});
