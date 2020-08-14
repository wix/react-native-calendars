import {getStorybookTab} from 'wix-react-native-storybook-template';

const StorybookScreen = () =>
  getStorybookTab(() => require('../../storybook'), module);

export default StorybookScreen;
