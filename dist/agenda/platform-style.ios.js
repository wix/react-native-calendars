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
            top: -10,
            flexDirection: "row",
            justifyContent: "space-around",
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 25,
            paddingBottom: 7,
            marginTop: 0,
            backgroundColor: appStyle.calendarBackground
        }
    };
}
