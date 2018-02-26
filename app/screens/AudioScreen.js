/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Button,
    Text, TouchableOpacity,
    View,
} from 'react-native';

import {
    Player,
    Recorder,
    MediaStates
} from 'react-native-audio-toolkit';

let RNFS = require('react-native-fs');

import styles from "../styles/main";

type Props = {};
const maxTime = 2;



export default class MainScreen extends Component<Props> {

    static navigationOptions = {
        title : 'Audio',
    };

    constructor(props) {
        super(props);

        this.state = {
            buttonText : "Start",
            timer : 0,
            recording: false,
        };

    }

    listFiles(rootDir) {
        console.log(rootDir);
        RNFS.readDir(rootDir)
            .then((result) => {
                result.forEach((item) => {
                    if (item.isFile()) {
                        console.log("FILE: " + item.name);
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    stopRecording() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        try {
            console.log("Stopping recording")
            let recorder = this.state.recorder;
            recorder.stop(() => {
                console.log("Stopped recording")
                this.listFiles(RNFS.DocumentDirectoryPath);
                this.setState({...this.state, ...{recording : false, recorder: null,buttonText: "Start"}});
            })
        } catch (error) {
            console.error(error);
        }
    }

    startRecording() {
        let filename = `test-${Date.now()}.mp4`;
        let options = {};

        try {
            console.log(`Starting recording for ${filename}`)
            let recorder = new Recorder(filename, options);
            recorder.record(() => {
                this.setState({...this.state, ...{recorder: recorder, recording : true, buttonText: "Stop"}});
                console.log(`Recording started for ${filename}`)
            })
        } catch (error) {
            console.error(error);
        }
    };

    toggleRecording() {
        console.log("Toggling recording")
        if (this.state.recording) {
            console.log("Stopping recording")
            this.stopRecording()
        } else {
            console.log("Starting recording")
            this.startRecording()
        }
    }

    render() {
        return (
            <View style={styles.container2}>
                <View style={{flex : 0, flexDirection : 'row', justifyContent : 'center',}}>
                    <TouchableOpacity
                        onPress={() => this.toggleRecording()}
                        style={styles.capture}
                    >
                        <Text style={{fontSize : 14}}> {this.state.buttonText} </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
