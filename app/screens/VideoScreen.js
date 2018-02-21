/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Button,
    Text, TouchableOpacity,
    View
} from 'react-native';

import styles from "../styles/main";

type Props = {};
export default class MainScreen extends Component<Props> {

    static navigationOptions = {
        title : 'Video',
    };

    constructor(props) {
        super(props);

        this.state = {}
    }

    click() {

    }

    render() {
        return (
            <View style={styles.container2}>
                <Text style={[styles.welcome, styles.redText]}>
                    !!!! {this.props.navigation.state.params.text} !!!
                </Text>
                <Button
                    title="Video!"
                    color="#aabbcc"
                    onPress={() => this.click()}/>
            </View>
        );
    }
}
