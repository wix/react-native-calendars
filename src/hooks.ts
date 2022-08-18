import React, {useEffect, useRef, DependencyList} from 'react';

/**
 * This hook avoid calling useEffect on the initial value of his dependency array
 */
export const useDidUpdate = (callback: () => void, dep: DependencyList) => {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (isMounted.current) {
      callback();
    } else {
      isMounted.current = true;
    }
  }, dep);
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
