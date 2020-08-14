import {storiesOf} from 'wix-react-native-storybook-template';
import dayStories from './stories/day';

export const stories = [dayStories];

stories.forEach(fn => fn(storiesOf, module));
