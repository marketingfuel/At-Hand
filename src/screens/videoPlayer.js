import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import
MediaControls, { PLAYER_STATES }
    from 'react-native-media-controls';
import COLORS from '../config/COLORS';
import Font from '../config/Font';

const MediaVideoPlayer = ({ route, navigation }) => {
    const type = route.params ? route.params.type : null;
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [
        playerState, setPlayerState
    ] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState('contain');
     console.log(type);
    const onSeek = (seek) => {
        videoPlayer.current.seek(seek);
    };

    const onPaused = (playerState) => {
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer.current.seek(0);
    };

    const onProgress = (data) => {
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
    };

    const onLoadStart = (data) => setIsLoading(true);

    const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

    const onFullScreen = () => {
        setIsFullScreen(isFullScreen);
        if (screenType == 'contain') setScreenType('cover');
        else setScreenType('contain');
    };
    const renderToolbar = () => (
        <View>
            <Text style={styles.toolbar}> toolbar </Text>
        </View>
    );

    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    console.log(type.video)

    return (
        <View style={{ width: wp('100%'), height: hp('100%'), justifyContent: 'center', backgroundColor: COLORS.black, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('2%'), alignItems: 'center' }}>
                <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.white}
                    style={{ alignSelf: 'center', marginRight: wp('2.5%'), }}
                />
                <Text style={{ color: COLORS.white, fontFamily: Font.bold, fontSize: hp('2%'), alignSelf: 'center', paddingTop: hp('0.5%') }}>
                    Close
                </Text>
            </TouchableOpacity>
            {
                type.video && 
                    <View style={{ width: wp('100%'), height: hp('50%'), justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: "center" }}>
                        <Video
                            onEnd={onEnd}
                            onLoad={onLoad}
                            onLoadStart={onLoadStart}
                            onProgress={onProgress}
                            paused={paused}
                            ref={videoPlayer}
                            resizeMode={screenType}
                            onFullScreen={isFullScreen}
                            fullscreen={true}
                            source={{
                                uri: `${type.video}`
                            }}
                            style={styles.mediaPlayer}
                            volume={10}
                        />
                        <MediaControls
                            duration={duration}
                            isLoading={isLoading}
                            mainColor="#333"
                            onFullScreen={onFullScreen}
                            onPaused={onPaused}
                            onReplay={onReplay}
                            onSeek={onSeek}
                            onSeeking={onSeeking}
                            playerState={playerState}
                            progress={currentTime}
                            toolbar={renderToolbar()}
                        />
                    </View>
            }
        </View>
    );
};

export default MediaVideoPlayer;

const styles = StyleSheet.create({
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignSelf: 'center',
    },
});