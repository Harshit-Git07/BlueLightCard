import { subMenuEntityFactory } from './SubMenuEntityFactory';

describe('SubMenuEntityFactory', () => {
  it('should build a default SubMenuEntity object', () => {
    const subMenuEntity = subMenuEntityFactory.build();
    expect(subMenuEntity).toEqual({
      partitionKey: 'MENU-1',
      sortKey: 'SUB_MENU-1',
      gsi1PartitionKey: 'MENU_TYPE-1',
      gsi1SortKey: 'MENU_TYPE-1',
      gsi2PartitionKey: 'SUB_MENU-1',
      gsi2SortKey: 'SUB_MENU-1',
      id: '1',
      description: 'Sample description',
      imageURL: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      title: 'Sample SubMenu title',
      position: 0,
    });
  });

  it('should build an SubMenuEntity object with overridden id', () => {
    const subMenuEntity = subMenuEntityFactory.build({ id: 'custom_id', partitionKey: 'custom_partition_key' });
    expect(subMenuEntity.id).toBe('custom_id');
    expect(subMenuEntity.partitionKey).toBe('custom_partition_key');
  });
});
