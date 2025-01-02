import { IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';

import { Repository } from './Repository';

class TestRepository extends Repository {
  withTransaction(): Repository {
    return this;
  }
}

describe('Repository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    const connection = {} as IDatabaseConnection;
    repository = new TestRepository(connection);
  });

  describe('atMostOne', () => {
    it('should return null for empty array', () => {
      expect(repository.atMostOne([])).toBeNull();
    });

    it('should return the single element', () => {
      const result = repository.atMostOne([1]);
      expect(result).toBe(1);
    });

    it('should throw error for multiple elements', () => {
      expect(() => repository.atMostOne([1, 2])).toThrow('Received multiple results but expected at most one');
    });
  });

  describe('exactlyOne', () => {
    it('should return the single element', () => {
      const result = repository.exactlyOne([1]);
      expect(result).toBe(1);
    });

    it('should throw error for empty array', () => {
      expect(() => repository.exactlyOne([])).toThrow('Received zero results but expected at exactly one');
    });

    it('should throw error for multiple elements', () => {
      expect(() => repository.exactlyOne([1, 2])).toThrow('Received multiple results but expected at exactly one');
    });
  });
});
