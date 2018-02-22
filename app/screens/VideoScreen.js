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
import {RNCamera} from 'react-native-camera';

import styles from "../styles/main";

type Props = {};
export default class MainScreen extends Component<Props> {

    static navigationOptions = {
        title : 'Video',
    };

    constructor(props) {
        super(props);

        this.state = {
            buttonText : "Start"
        };
    }

    takePicture() {
        if (this.camera) {
            const options = {maxDuration : 2};
            this.setState({...this.state, ...{buttonText : "Stop"}});
            const data = this.camera.recordAsync(options);
            data
                .then((param) => {
                    console.log(param.uri);
                    this.setState({...this.state, ...{buttonText : "Again?"}});
                })
                .catch(() => {
                    this.setState({...this.state, ...{buttonText : "SORRY"}});
                });
        }
    };

    render() {
        return (
            <View style={styles.container2}>
                <Text style={[styles.welcome, styles.redText]}>
                    !!!! {this.props.navigation.state.params.text} !!!
                </Text>

                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.front}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                <View style={{flex : 0, flexDirection : 'row', justifyContent : 'center',}}>
                    <TouchableOpacity
                        onPress={() => this.takePicture()}
                        style={styles.capture}
                    >
                        <Text style={{fontSize : 14}}> {this.state.buttonText} </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
