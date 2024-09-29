import filter from 'lodash/filter';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { extractDotProps } from '../../../componentUpdater';
import styleConstructor from './style';
import Dot from '../dot';
export var Markings;
(function (Markings) {
    Markings["DOT"] = "dot";
    Markings["MULTI_DOT"] = "multi-dot";
    Markings["PERIOD"] = "period";
    Markings["MULTI_PERIOD"] = "multi-period";
    Markings["CUSTOM"] = "custom";
})(Markings || (Markings = {}));
const Marking = (props) => {
    const { theme, type, dots, periods, selected, dotColor } = props;
    const style = useRef(styleConstructor(theme));
    const getItems = (items) => {
        if (items && Array.isArray(items) && items.length > 0) {
            // Filter out items so that we process only those which have color property
            const validItems = filter(items, function (o) {
                return o.color;
            });
            return validItems.map((item, index) => {
                return type === Markings.MULTI_DOT ? renderDot(index, item) : renderPeriod(index, item);
            });
        }
    };
    const renderMarkingByType = () => {
        switch (type) {
            case Markings.MULTI_DOT:
                return renderMultiMarkings(style.current.dots, dots);
            case Markings.MULTI_PERIOD:
                return renderMultiMarkings(style.current.periods, periods);
            default:
                return renderDot();
        }
    };
    const renderMultiMarkings = (containerStyle, items) => {
        return <View style={containerStyle}>{getItems(items)}</View>;
    };
    const renderPeriod = (index, item) => {
        const { color, startingDay, endingDay } = item;
        const styles = [
            style.current.period,
            {
                backgroundColor: color
            }
        ];
        if (startingDay) {
            styles.push(style.current.startingDay);
        }
        if (endingDay) {
            styles.push(style.current.endingDay);
        }
        return <View key={index} style={styles}/>;
    };
    const renderDot = (index, item) => {
        const dotProps = extractDotProps(props);
        let key = index;
        let color = dotColor;
        if (item) {
            if (item.key) {
                key = item.key;
            }
            color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
        }
        return <Dot {...dotProps} key={key} color={color}/>;
    };
    return renderMarkingByType();
};
export default Marking;
Marking.displayName = 'Marking';
Marking.markings = Markings;
