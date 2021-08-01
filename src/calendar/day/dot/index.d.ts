/// <reference types="react" />
import PropTypes from 'prop-types';
import { Theme } from '../../../commons/types';
export interface DotProps {
    theme?: Theme;
    color?: String;
    marked?: Boolean;
    selected?: Boolean;
    disabled?: Boolean;
    today?: Boolean;
}
declare const Dot: {
    ({ theme, marked, disabled, color, today, selected }: DotProps): JSX.Element;
    propTypes: {
        theme: PropTypes.Requireable<object>;
        color: PropTypes.Requireable<string>;
        marked: PropTypes.Requireable<boolean>;
        selected: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        today: PropTypes.Requireable<boolean>;
    };
};
export default Dot;
