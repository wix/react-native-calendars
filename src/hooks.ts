import React, {useEffect, useRef, DependencyList, EffectCallback} from 'react';

/**
 * This hook avoid calling useEffect on the initial value of his dependency array
 */


export const useDidUpdate = (effectCallback: EffectCallback, deps?: DependencyList): void => {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (isMounted.current) {
      effectCallback();
    } else {
      isMounted.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export const useCombinedRefs = (...refs: React.Ref<any>[]) => {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        // @ts-expect-error
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
