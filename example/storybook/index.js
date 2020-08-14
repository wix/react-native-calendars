import {storiesOf} from 'wix-react-native-storybook-template';
import dayStories from './stories/day';
import dotStories from './stories/dot';

export const stories = [dayStories, dotStories];

stories.forEach(fn => fn(storiesOf, module));
