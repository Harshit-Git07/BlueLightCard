import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import ListSelector from './';
import { ListSelectorProps, ListSelectorState } from './types';
import Tag from '../Tag';

describe('ListSelector component', () => {
  let props: ListSelectorProps;

  beforeEach(() => {
    props = {};
  });

  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<ListSelector {...props} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render default list selector with title, description, tag and trailing icon  ', () => {
    const component = renderer.create(
      <ListSelector
        title={'Default List Selector'}
        description={'This is a default list selector'}
        tag={<Tag state={'Success'} />}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render default list selector with hidden tag', () => {
    const component = renderer.create(
      <ListSelector
        title={'Default List Selector'}
        description={'This is a default list selector'}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render default list selector with hidden description', () => {
    const component = renderer.create(
      <ListSelector title={'Default List Selector'} tag={<Tag state={'Success'} />} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render default list selector with hidden trailing icon', () => {
    const component = renderer.create(
      <ListSelector
        title={'Default List Selector'}
        description={'This is a default list selector'}
        tag={<Tag state={'Success'} />}
        showTrailingIcon={false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render default list selector with in selected state', () => {
    const component = renderer.create(
      <ListSelector
        state={ListSelectorState.Selected}
        title={'Default List Selector'}
        tag={<Tag state={'Success'} />}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render default list selector with in hover state', () => {
    const component = renderer.create(
      <ListSelector
        state={ListSelectorState.Hover}
        title={'Default List Selector'}
        tag={<Tag state={'Success'} />}
        ariaLabel={'List Selector'}
        onClick={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
