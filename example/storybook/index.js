import {storiesOf} from 'wix-react-native-storybook-template';
import dayStories from './stories/day';
import dotStories from './stories/dot';
import headerStories from './stories/header';

export const stories = [dayStories, dotStories, headerStories];

stories.forEach(fn => fn(storiesOf, module));
