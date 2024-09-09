import { categoryFactory } from './CategoryFactory';

describe('Category Factory', () => {
  it('should build a default Category object', () => {
    const category = categoryFactory.build();
    expect(category).toEqual({
      id: 1,
      name: 'Skiing',
      parentCategoryIds: ['12'],
      level: 3,
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a Category object with overridden name', () => {
    const category = categoryFactory.build({ name: 'Snowboarding' });
    expect(category.name).toBe('Snowboarding');
  });
});
