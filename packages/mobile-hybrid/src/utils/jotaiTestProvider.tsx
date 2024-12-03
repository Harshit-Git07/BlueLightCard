import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';

const HydrateAtoms = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => {
  useHydrateAtoms(initialValues);
  return children;
};

export const JotaiTestProvider = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);
