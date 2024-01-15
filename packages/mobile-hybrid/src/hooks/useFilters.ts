import { PrimitiveAtom, useAtom } from 'jotai';
import { useState, useCallback, useMemo, useEffect } from 'react';

export const useFilters = (filters: PrimitiveAtom<string[]>) => {
  const [state, setState] = useAtom(filters);
  const [draft, setDraft] = useState<string[]>([]);

  useEffect(() => {
    setDraft(state);
  }, [state]);

  /**
   * @param commit - Commit a filter to the draft state
   */
  const commit = useCallback(
    (filter: string, action: 'add' | 'remove' = 'add') => {
      if (!draft.includes(filter) && action === 'add') {
        setDraft([filter].concat(...draft));
      } else if (draft.includes(filter) && action === 'remove') {
        setDraft(draft.filter((_filter) => _filter !== filter));
      }
    },
    [draft],
  );
  /**
   * @param save - Save the draft state to the stored state
   */
  const save = useCallback(() => {
    const storedFilters = Array.from(state);

    if (draft.length) {
      for (const filter of draft) {
        if (!storedFilters.includes(filter)) {
          storedFilters.push(filter);
        }
      }
      for (const filter of Array.from(state)) {
        if (!draft.includes(filter)) {
          storedFilters.splice(
            storedFilters.findIndex((storedFilter) => storedFilter === filter),
            1,
          );
        }
      }

      setDraft([]);
      setState(storedFilters);
    }
  }, [draft, state, setState]);

  /**
   * @param reset - Reset the draft state to the stored state
   */
  const reset = useCallback(() => {
    setState([]);
    setDraft([]);
  }, [setState, setDraft]);

  return { commit, save, reset, draft };
};
