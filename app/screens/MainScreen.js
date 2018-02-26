/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Button,
    Platform,
    Text,
    View
} from 'react-native';

import styles from "../styles/main";
import {navigate} from "react-navigation";

const Chance = require('chance'),
    chance = new Chance();

const instructions = Platform.select({
    ios : 'Press Cmd+R to reload,\n' +
          'Cmd+D or shake for dev menu',
    android : 'Double tap R on your keyboard to reload,\n' +
              'Shake or press menu button for dev menu',
});

type Props = {};
export default class MainScreen extends Component<Props> {

    static navigationOptions = {
        title : 'Welcome',
    };

    constructor(props) {
        super(props);

        this.state = {
            buttonColor : "#abcdef",
            text : "Initial text"
        }
    }

    changeButtonColor() {
        let newColor;
        if (this.state.buttonColor === "#abcdef") {
            newColor = "#848584";
        } else {
            newColor = "#abcdef";
        }

        this.setState({...this.state, ...{buttonColor : newColor}});
    }

    changeText() {
        this.setState({...this.state, ...{text : chance.paragraph()}});
    }

    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    ** Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    {instructions}
                </Text>
                <Text>
                    {this.state.text}
                </Text>
                <Button
                    title="Change buttons color"
                    color={this.state.buttonColor}
                    onPress={() => this.changeButtonColor()}/>
                <Button
                    title="Change the text"
                    color={this.state.buttonColor}
                    onPress={() => this.changeText()}/>
                <Button
                    title="Go away"
                    color={this.state.buttonColor}
                    onPress={() => navigate('Video', {text: "foo bar!"})}/>
                <Button
                    title="Let's talk"
                    color={this.state.buttonColor}
                    onPress={() => navigate('Audio')}/>
            </View>
        );
    }
}
