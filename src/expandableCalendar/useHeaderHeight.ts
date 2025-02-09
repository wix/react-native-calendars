import {useCallback, useState} from 'react';
import type {LayoutChangeEvent} from 'react-native';

const useHeaderHeight = () => {
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const onHeaderLayout = useCallback(({nativeEvent: {layout: {height}}}: LayoutChangeEvent) => {
        setHeaderHeight(height);
    }, []);
    
    return {
        headerHeight,
        onHeaderLayout,
    };
};

export default useHeaderHeight;
