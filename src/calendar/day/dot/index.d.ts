import React from 'react';
import { Theme } from '../../../types';
export interface DotProps {
    theme?: Theme;
    color?: string;
    marked?: boolean;
    selected?: boolean;
    disabled?: boolean;
    inactive?: boolean;
    today?: boolean;
}
declare const Dot: ({ theme, marked, disabled, inactive, color, today, selected }: DotProps) => React.JSX.Element;
export default Dot;
