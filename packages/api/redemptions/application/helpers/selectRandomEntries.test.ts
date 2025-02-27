import { describe, expect } from '@jest/globals';

import { selectRandomEntries } from './selectRandomEntries';

describe('selectRandomEntries', () => {
  it('should return empty array when items is empty', () => {
    const items = [] as { id: string }[];
    const selectedEntries = selectRandomEntries(items, 10);
    expect(selectedEntries.length).toBe(0);
  });

  it('should return all items when total tickets > total items', () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ id: i.toString() }));
    const selectedEntries = selectRandomEntries(items, 10);
    expect(new Set(selectedEntries).size).toBe(5);
  });

  it('should return all items when total tickets = total items', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() }));
    const selectedEntries = selectRandomEntries(items, 10);
    expect(new Set(selectedEntries).size).toBe(10);
  });

  it('should return 10 unique items from an array of 10 items', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i.toString() }));
    const selectedEntries = selectRandomEntries(items, 10);
    expect(new Set(selectedEntries).size).toBe(10);
  });

  it('should return 10 unique items from an array of 1000000 items', () => {
    const items = Array.from({ length: 1_000_000 }, (_, i) => ({ id: i.toString() }));
    const selectedEntries = selectRandomEntries(items, 10);
    expect(new Set(selectedEntries).size).toBe(10);
  });
});
