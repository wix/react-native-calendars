export default function platformStyles(appStyle) {
    return {
        knob: {
            width: 38,
            height: 7,
            marginTop: 10,
            borderRadius: 3,
            backgroundColor: appStyle.agendaKnobColor
        },
        weekdays: {
            position: "absolute",
            left: 0,
            right: 0,
            top: -18,
            flexDirection: "row",
            justifyContent: "space-around",
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 26,
            paddingBottom: 8,
            backgroundColor: appStyle.calendarBackground
        }
    };
}
