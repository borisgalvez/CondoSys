import { useCallback, useState } from 'react';

export const useToggle = (initialState: boolean = false) => {
  const [state, setState] = useState<boolean>(initialState);
  const open = useCallback(() => {
    setState(true);
  }, []);
  const close = useCallback(() => {
    setState(false);
  }, []);
  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);
  return { state, open, close, toggle } as const;
};