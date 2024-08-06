import renderer from 'react-test-renderer';
import ReactDom from 'react-dom';
import SearchEmptyState from '../../SearchEmptyState/SearchEmptyState';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

const mockData = {
  data: {
    response: {
      categories: [
        {
          id: '8',
          name: 'Fashion',
          __typename: 'CategoryMenu',
        },
        {
          id: '16',
          name: 'Featured',
          __typename: 'CategoryMenu',
        },
      ],
    },
  },
};

jest.mock('react-dom', () => ({
  ...jest.requireActual<typeof ReactDom>('react-dom'),
  preload: jest.fn(),
}));

let mockRouter: Partial<NextRouter>;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('SearchDropDown', () => {
  it('should match snapshot', () => {
    const { data } = mockData;
    const onSearchCompanyChange = jest.fn();
    const onSearchCategoryChange = jest.fn();
    const component = renderer.create(
      <RouterContext.Provider value={mockRouter as NextRouter}>
        <SearchEmptyState onSearchCategoryChange={onSearchCategoryChange} {...data} />
      </RouterContext.Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
