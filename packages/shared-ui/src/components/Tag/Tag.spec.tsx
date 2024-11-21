import Tag from './index';
import { TagState } from './types';
import renderer from 'react-test-renderer';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';

describe('Tag', () => {
  describe('snapshot Test', () => {
    it('renders a tag in default state', () => {
      const component = renderer.create(
        <Tag infoMessage="Tag" iconLeft={faCircleBolt} iconRight={faCircleBolt}></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag in Success state', () => {
      const component = renderer.create(
        <Tag
          infoMessage="Tag"
          iconLeft={faCircleBolt}
          iconRight={faCircleBolt}
          state={TagState.Success}
        ></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag in Error state', () => {
      const component = renderer.create(
        <Tag
          infoMessage="Tag"
          iconLeft={faCircleBolt}
          iconRight={faCircleBolt}
          state={TagState.Error}
        ></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag in Warning state', () => {
      const component = renderer.create(
        <Tag
          infoMessage="Tag"
          iconLeft={faCircleBolt}
          iconRight={faCircleBolt}
          state={TagState.Warning}
        ></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag in Info state', () => {
      const component = renderer.create(
        <Tag
          infoMessage="Tag"
          iconLeft={faCircleBolt}
          iconRight={faCircleBolt}
          state={TagState.Info}
        ></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag Without an Icon', () => {
      const component = renderer.create(<Tag infoMessage="Tag" state={TagState.Warning}></Tag>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a tag With 1 Icon', () => {
      const component = renderer.create(
        <Tag infoMessage="Tag" iconLeft={faCircleBolt} state={TagState.Warning}></Tag>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
