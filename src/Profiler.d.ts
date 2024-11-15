import React, { ProfilerProps as RProfilerProps, PropsWithChildren } from 'react';
export declare type ProfilerProps = Pick<RProfilerProps, 'id'>;
export default class Profiler extends React.Component<PropsWithChildren<ProfilerProps>> {
    onRender: (...profileData: any[]) => void;
    render(): React.JSX.Element;
}
export declare const getProfileData: ([id, phase, actualDuration, baseDuration, startTime, commitTime, interactions]: [any, any, any, any, any, any, any]) => {
    id: any;
    interactions: any;
    phase: any;
    actualDuration: number;
    baseDuration: number;
    commitTime: number;
    cumulativeDuration: string;
    startTime: number;
};
export declare const logProfileData: ({ id, actualDuration, cumulativeDuration, phase }: {
    id: any;
    actualDuration: any;
    cumulativeDuration: any;
    phase: any;
}) => void;
