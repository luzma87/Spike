import { AppRegistry } from 'react-native';
import {StackNavigator} from "react-navigation";
import MainScreen from './app/screens/MainScreen';
import VideoScreen from "./app/screens/VideoScreen";

const SimpleApp = StackNavigator({
    Main: { screen: MainScreen },
    Video: { screen: VideoScreen, title: "Second Screen" }
});

AppRegistry.registerComponent('Spike', () => SimpleApp);
