// @ts-nocheck

// Taken from
// https://medium.com/life-at-paperless/how-to-use-the-react-profiler-component-to-measure-performance-improvements-from-hooks-d43b7092d7a8

// Profiler callback
// https://reactjs.org/docs/profiler.html#onrender-callback

import React, {Profiler as RProfiler, ProfilerProps as RProfilerProps, PropsWithChildren} from 'react';

export type ProfilerProps = Pick<RProfilerProps, 'id'>;

// The entire render time since execution of this file (likely on page load)
const cumulativeDuration: {[key: string]: string} = {};

export default class Profiler extends React.Component<PropsWithChildren<ProfilerProps>> {
  onRender = (...profileData) => {
    logProfileData(getProfileData(profileData));
  };

  render() {
    const {children, id} = this.props;
    return (
      <RProfiler id={id} onRender={this.onRender}>
        {children}
      </RProfiler>
    );
  }
}

// TODO: fix typescript...
export const getProfileData = ([
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
]) => {
  cumulativeDuration[id] = Number(((cumulativeDuration[id] ?? 0) + actualDuration).toFixed(2));
  return {
    id,
    interactions,
    phase,
    actualDuration: Number(actualDuration.toFixed(2)),
    baseDuration: Number(baseDuration.toFixed(2)),
    commitTime: Number(commitTime.toFixed(2)),
    cumulativeDuration: cumulativeDuration[id],
    startTime: Number(startTime.toFixed(2))
  };
};

export const logProfileData = ({id, actualDuration, cumulativeDuration, phase}) => {
  console.group(phase);
  // table did not work for me so I used log instead
  console.log(id, ':', actualDuration, cumulativeDuration);
  // console.table({
  //   actualDuration,
  //   baseDuration,
  //   cumulativeDuration
  // });
  console.groupEnd();
};
