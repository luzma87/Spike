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

        this.state = {}
    }

    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)
            console.log(data.uri);
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
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                <View style={{flex : 0, flexDirection : 'row', justifyContent : 'center',}}>
                    <TouchableOpacity
                        onPress={this.takePicture.bind(this)}
                        style={styles.capture}
                    >
                        <Text style={{fontSize : 14}}> SNAP </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
