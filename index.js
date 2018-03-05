import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { MainScreen } from './app/screens/MainScreen';
import { VideoScreen } from './app/screens/VideoScreen';
import { AudioScreen } from './app/screens/AudioScreen';

const SimpleApp = StackNavigator({
  Main: { screen: MainScreen },
  Video: { screen: VideoScreen, title: 'Second Screen' },
  Audio: { screen: AudioScreen, title: 'Audio Screen' },
});


AppRegistry.registerComponent('Spike', () => SimpleApp);
