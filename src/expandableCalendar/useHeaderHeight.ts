import {useCallback, useState} from 'react';
import type {LayoutChangeEvent} from 'react-native';
import _ from 'lodash';
import type {ExpandableCalendarProps} from '.';
import {HEADER_HEIGHT} from './style';
import constants from '../commons/constants';

const useHeaderHeight = ({horizontal}: Pick<ExpandableCalendarProps, 'horizontal'>) => {
    const [headerHeight, setHeaderHeight] = useState<number>(horizontal ? 0 : HEADER_HEIGHT + (constants.isAndroid ? 8 : 9));
    console.log(`Nitzan - headerheih`, headerHeight);
    const onHorizontalHeaderLayout = useCallback(({nativeEvent: {layout: {height}}}: LayoutChangeEvent) => {
        setHeaderHeight(height);
    }, []);
    const onVerticalHeaderLayout = _.noop;
    
    return {
        headerHeight,
        onHeaderLayout: horizontal ? onHorizontalHeaderLayout : onVerticalHeaderLayout,
    };
};

export default useHeaderHeight;