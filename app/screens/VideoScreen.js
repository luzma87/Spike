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

import VideoPlayer from 'react-native-video-player';
import {RNCamera} from 'react-native-camera';

let RNFS = require('react-native-fs');
const VIMEO_ID = '179859217';

import styles from "../styles/main";


type Props = {};
const maxTime = 2;
export default class MainScreen extends Component<Props> {

    static navigationOptions = {
        title: 'Video',
    };

    constructor(props) {
        super(props);

        this.state = {
            buttonText: "Start",
            timer: 0,
            video: {width: undefined, height: undefined, duration: undefined},
            thumbnailUrl: undefined,
            videoUrl: undefined,
        };
    }

    componentDidMount() {
        global.fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
            .then(res => res.json())
            .then(res => this.setState({
                thumbnailUrl: res.video.thumbs['640'],
                videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
                video: res.video,
            }));
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

    takePicture() {
        const rootDir = RNFS.DocumentDirectoryPath;
        // const rootDir = RNFS.ExternalStorageDirectoryPath;

        if (this.camera) {
            const options = {maxDuration: maxTime};
            this.setState({...this.state, ...{buttonText: "Stop", recording: true}});
            let interval = this.startTimer();
            const data = this.camera.recordAsync(options);
            data
                .then((param) => {
                    this.stopTimer(interval);
                    let filename = `test-${Date.now()}.mp4`;

                    let destPath = `${rootDir}/${filename}`;
                    const result = RNFS.moveFile(param.uri, destPath);
                    result.then(() => {
                        // console.log(destPath);
                        console.log('File successfully copied')
                    }).catch((error) => {
                        console.log(error);
                    });

                    this.setState({...this.state, ...{buttonText: "Again?", recording: false}});

                    this.listFiles(rootDir);
                })
                .catch(() => {
                    this.stopTimer(interval);
                    this.setState({...this.state, ...{buttonText: "SORRY", recording: false}});
                });
        }
    };

    startTimer() {
        return setInterval(() => {
            let c = this.state.timer;
            this.setState({...this.state, ...{timer: c + 1}});
        }, 1000);
    }

    stopTimer(interval) {
        clearInterval(interval);
        this.setState({...this.state, ...{timer: ''}});
    }

    render() {
        return (
            <View style={styles.container2}>

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
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', display: 'none'}}>
                    <TouchableOpacity
                        onPress={() => this.takePicture()}
                        style={styles.capture}
                    >
                        <Text style={{fontSize: 14}}> {this.state.buttonText} </Text>
                    </TouchableOpacity>
                    {this.state.recording ?
                        <Text style={{color: 'purple'}}>{maxTime - this.state.timer}</Text> :
                        null}

                </View>


                <View>
                    <Text style={{fontSize: 22, marginTop: 22}}>React Native Video Player</Text>
                    <VideoPlayer
                        endWithThumbnail
                        thumbnail={{uri: this.state.thumbnailUrl}}
                        video={{uri: this.state.videoUrl}}
                        videoWidth={this.state.video.width}
                        videoHeight={this.state.video.height}
                        onStart={() => this.takePicture()}
                        duration={this.state.video.duration}
                        ref={r => this.player = r}
                    />
                    <Button
                        onPress={() => this.player.stop()}
                        accessibilityLabel="btn6"
                        title="Stop"
                    />
                    <Button
                        onPress={() => this.player.pause()}
                        accessibilityLabel="btn7"
                        title="Pause"
                    />
                    <Button
                        onPress={() => this.player.resume()}
                        accessibilityLabel="btn8"
                        title="Resume"
                    />
                </View>


            </View>
        );
    }
}
