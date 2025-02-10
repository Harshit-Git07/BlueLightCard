import { subMenuFactory } from './SubMenuFactory';

describe('SubMenu Factory', () => {
  it('should build a default SubMenu object', () => {
    const subMenu = subMenuFactory.build();
    expect(subMenu).toEqual({
      id: '1',
      description: 'Sample description',
      imageURL: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      title: 'Sample SubMenu title',
      position: 0,
    });
  });

  it('should build an SubMenu object with overridden id', () => {
    const subMenu = subMenuFactory.build({ id: 'custom_id' });
    expect(subMenu.id).toBe('custom_id');
  });
});
