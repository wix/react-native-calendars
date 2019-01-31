import { Navigation } from "react-native-navigation";
import AgendaScreen from "./agenda";
import CalendarsScreen from "./calendars";
import CalendarsList from "./calendarsList";
import HorizontalCalendarList from "./horizontalCalendarList";
import MenuScreen from "./menu";

export function registerScreens() {
  Navigation.registerComponent("Menu", () => MenuScreen);
  Navigation.registerComponent("Calendars", () => CalendarsScreen);
  Navigation.registerComponent("Agenda", () => AgendaScreen);
  Navigation.registerComponent("CalendarsList", () => CalendarsList);
  Navigation.registerComponent(
    "HorizontalCalendarList",
    () => HorizontalCalendarList
  );
}
