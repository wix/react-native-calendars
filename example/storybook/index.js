import {storiesOf} from 'wix-react-native-storybook-template';
import dayStories from './stories/day';
import dotStories from './stories/dot';
import headerStories from './stories/header';
import reservationListStories from './stories/reservation-list';

export const stories = [
  dayStories,
  dotStories,
  headerStories,
  reservationListStories,
];

stories.forEach(fn => fn(storiesOf, module));
