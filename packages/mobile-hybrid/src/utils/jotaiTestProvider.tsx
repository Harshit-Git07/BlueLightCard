import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';

// @ts-ignore
const HydrateAtoms = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues);
  return children;
};

// @ts-ignore
export const JotaiTestProvider = ({ initialValues, children }) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);
