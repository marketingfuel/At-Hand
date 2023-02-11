import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, View, ScrollView, Alert, Text,Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import COLORS from '../config/COLORS';
import Moment from 'moment';
import Font from '../config/Font';
import { Formik } from 'formik';
import CustomInput from '../components/CustomInput';
import CustomErrorText from '../components/customErrorText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/customButton';
import { ReportIssueValidation } from '../utils/validation';
import CustomLoadingBtn from '../components/customLoadingBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import Upload from 'react-native-background-upload';
import Modal from "react-native-modal";
import { ProgressView } from '@react-native-community/progress-view';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

import
MediaControls, { PLAYER_STATES }
    from 'react-native-media-controls';
import axios from 'axios';

const ReportIssue = ({ navigation }) => {
    const [vid, setVid] = useState(null);
    const [Loader, setLoader] = useState(false);
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [apiProgress, setApiProgress] = useState();
    const [progress, setCompressingProgress] = useState();
    const [
        playerState, setPlayerState
    ] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState('contain');
    const [progressDialogVisible, setProgressDialogVisible] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [progressValue, setProgressValue] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // useEffect(() => {
    //     console.log(progressValue)
    // }, [progressValue])

    const onSeek = (seek) => {
        //Handler for change in seekbar
        videoPlayer.current.seek(seek);
    };

    const onPaused = (playerState) => {
        //Handler for Video Pause
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        //Handler for Replay
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer.current.seek(0);
    };

    const onProgress = (data) => {
        // Video Player will progress continue even if it ends
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

    const selectVideo = async () => {
        ImagePicker.launchImageLibrary({ mediaType: 'video', includeBase64: true, videoQuality: "low" }, (response) => {
            if (response.didCancel) {
            } else {
                console.log(response);
                setVid(response.assets[0])
            }
        })
    }

    const RecordVideo = async () => {
        ImagePicker.launchCamera({ mediaType: 'video', includeBase64: true }, (response) => {
            if (response.didCancel) {
            } else {
                setVid(response.assets[0])
            }
        })
    }

    // var ReportIssue = async (values, { resetForm }) => {
    //     let userToken = await AsyncStorage.getItem('userToken');
    //     let userId = await AsyncStorage.getItem('userId');
    //     setLoader(true);
    //     const date = new Date();
    //     const dateVal = Moment(date).format('DD-MM-YYYY');
    //     var myHeaders = new Headers();
    //     myHeaders.append("Accept", "application/json");
    //     myHeaders.append("Authorization", `Bearer ${userToken}`);
    //     myHeaders.append('Content-Type', 'multipart/form-data');
    //     var formdata = new FormData();
    //     formdata.append('file', vid === null ? 'null' :
    //         {
    //             uri: vid.uri,
    //             name: vid.fileName,
    //             type: vid.type,
    //         });
    //     formdata.append("title", values.title);
    //     formdata.append("user_id", userId);
    //     formdata.append("additional_note", values.additionalNote);
    //     formdata.append("date", dateVal)
    //     const data = { title: values.title, date: dateVal, additional_note: values.additionalNote, file: vid.uri, }

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: formdata,
    //         redirect: 'follow',
    //     };
    //     fetch("https://propertyupkeepmanagement.com/api/save-report", requestOptions)

    //         //     navigation.navigate("Home")
    //         // alert("Your Report has successfully been submitted")
    //         .then(response => response.text())
    //         .then((result) => {
    //             setLoader(false);
    //             navigation.navigate("Home")
    //             alert("Your Report has successfully been submitted")
    //         }
    //         )
    //         .catch(error => {
    //             setLoader(false)
    //             Alert.alert("Network or server Error",)
    //         }
    //         );
    // }
    const adjustUri = old => {
        if (Platform.OS === 'android') {
            if (old.startsWith('file://')) {
                return old.replace('file://', '/');
            }
        }
        return old;
    }


    // var ReportIssue = async (values, { resetForm }) => {
    //     let userToken = await AsyncStorage.getItem('userToken');
    //     let userId = await AsyncStorage.getItem('userId');
    //     const date = new Date();
    //     const dateVal = Moment(date).format('DD-MM-YYYY');
    //     const options = {
    //         url: "https://propertyupkeepmanagement.com/api/save-report",
    //         path: adjustUri(vid.uri),
    //         method: "POST",
    //         type: "multipart",
    //         headers: {
    //             Authorization: 'Bearer ' + userToken,
    //             Accept: 'application/json'
    //         },
    //         field: 'file',
    //         notification: {
    //             enabled: true
    //         },
    //         parameters: {
    //             title: values.title,
    //             user_id: userId,
    //             additional_note: values.additionalNote,
    //             date: dateVal,
    //             file: vid.uri
    //         },
    //         useUtf8Charset: true,
    //         notification: {
    //             autoClear: true,
    //             onProgressTitle: "Uploading..."
    //         }
    //     }
    //     Upload.startUpload(options).then((uploadId) => {
    //         setModalVisible(true)
    //         Upload.addListener('progress', uploadId, (data) => {
    //             setProgressValue(data.progress)
    //         })
    //         Upload.addListener('completed', uploadId, (data) => {
    //             setModalVisible(false)
    //             navigation.navigate("Home")
    //             alert("Your Report has successfully been submitted")
    //         })
    //     }).catch((err) => {
    //         setModalVisible(false)
    //         alert("Server Or Network Error")
    //     })
    // };

    var ReportIssue = async (values, { resetForm }) => {
     if(vid)
       locallySaveVideo(vid,values);
    //    saveVideoToFirebase(vid,values);
    }
    
    const locallySaveVideo = async (video, values)=>{
        setLoader(true);
        submitForm(values,video);
    }

    const saveVideoToFirebase =  (file,values) => {
        setLoader(true);
        setModalVisible(true);
       let videoName = file?.fileName;
       let splitVideoName = videoName?.split(" ");
       let finalVideoName = splitVideoName[splitVideoName?.length-1] || videoName;
       console.log(finalVideoName);

       let uri = file?.uri;
       let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

       var storageRef = firebase.storage().ref(finalVideoName);
        var uploadTask = storageRef.putFile(uploadUri);

        uploadTask.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressValue(progress);

                if(progress==100)
                setModalVisible(false);
                
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                setModalVisible(false);
                Alert.alert("Error uploading your video please try again")
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    submitForm(values,downloadURL);
                    console.log('File available at', downloadURL);
                });
            }
        );
    }

    const submitForm = async (values,video) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        const date = new Date();
        const _date = Moment(date).format('DD-MM-YYYY');

        const res = await axios.post(`https://propertyupkeepmanagement.com/api/save-report?title=${values.title}&date=${_date}&user_id=${userId}&additional_note=${values.additionalNote}&file=${decodeURIComponent(video?.uri)}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + userToken
                },
            })
            .then(res => {
                console.log(res);
                if (res.data?.report_id) {
                    navigation.navigate("Home",{refreshView:Math.floor(Math.random() * 1001),video:video,id:res.data?.report_id,values:values})
                    alert("Your Report has successfully been submitted")
                } else {
                    console.log("Error Uploading")
                }
            }
            )
            .catch(err => {
                alert("Failed to submit your Report please try again")
                console.log(err)
            })
            setLoader(false);
    }


    return (
        // <KeyboardAwareScrollView style={styles.main} showsVerticalScrollIndicator={false}>
            <SafeAreaView >
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.headerView}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: wp('95%'), alignSelf: 'center' }}>
                            <Text style={styles.logoutText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heading}>
                        Report an Issue
                    </Text>
                    <Formik
                        initialValues={{ title: '', additionalNote: '' }}
                        validateOnMount={true}
                        onSubmit={ReportIssue}
                        validationSchema={ReportIssueValidation}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                            <View>
                                <View style={styles.emailInput}>
                                    <CustomInput
                                        title="Title (required)"
                                        keyboardType="email-address"
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        defaultValue={values.title}
                                    />
                                    {(errors.title && touched.title) &&
                                        <CustomErrorText title={errors.title} />
                                    }
                                </View>
                                {
                                    vid === null ? (
                                        <View style={styles.videoView}>
                                            <TouchableOpacity onPress={RecordVideo}>
                                                <Text style={styles.recordBtn}>
                                                    Record Video
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ marginVertical: hp('1.5%'), color: COLORS.grayniteGray, textAlign: 'center', fontSize: hp('2%'), fontFamily: Font.medium }}>
                                                Or
                                            </Text>
                                            <TouchableOpacity onPress={selectVideo}>
                                                <Text style={styles.recordBtn}>
                                                    Upload Video
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.videoViewOne}>
                                            <TouchableOpacity onPress={() => setVid(null)} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('2%'), alignItems: 'center' }}>
                                                <FontAwesome
                                                    name="close"
                                                    size={20}
                                                    color={COLORS.blue}
                                                    style={{ alignSelf: 'center', marginRight: wp('2.5%'), }}
                                                />
                                                <Text style={{ color: COLORS.blue, fontFamily: Font.bold, fontSize: hp('2%'), alignSelf: 'center', paddingTop: hp('0.5%') }}>
                                                    cancel
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{ width: wp('80%'), height: hp('25%'), justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: "center" }}>
                                                <Video
                                                    onEnd={onEnd}
                                                    onLoad={onLoad}
                                                    onLoadStart={onLoadStart}
                                                    onProgress={onProgress}
                                                    paused={paused}
                                                    ref={videoPlayer}
                                                    resizeMode={screenType}
                                                    onFullScreen={isFullScreen}
                                                    source={{
                                                        uri: vid.uri
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
                                        </View>
                                    )
                                }
                                <View style={styles.emailInput}>
                                    <CustomInput
                                        title="Additional Notes"
                                        numberOfLines={6}
                                        multiline={true}
                                        height={'auto'}
                                        keyboardType="email-address"
                                        onChangeText={handleChange('additionalNote')}
                                        onBlur={handleBlur('additionalNote')}
                                        defaultValue={values.additionalNote}
                                    />
                                    {(errors.additionalNote && touched.additionalNote) &&
                                        <CustomErrorText title={errors.additionalNote} />
                                    }
                                </View>

                                {Loader ? (
                                    <CustomLoadingBtn
                                        color={COLORS.white}
                                        size="small"
                                        style={styles.postBTn}
                                    />
                                ) : (
                                    <CustomButton
                                        onPress={handleSubmit}
                                        title="Submit"
                                        style={styles.postBTn}
                                    />
                                )}
                            </View>
                        )}
                    </Formik>
                    <Modal
                        isVisible={isModalVisible}
                    >
                        <View style={{ width: wp('90%'), height: hp('16%'), alignSelf: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 20 }}>
                            <Text style={{ fontSize: hp('2.5%'), fontFamily: Font.medium, color: COLORS.black, alignSelf: 'center' }}>
                                Uploading Started
                            </Text>
                            <Text style={{ fontSize: hp('2%'), fontFamily: Font.medium, color: COLORS.primary, alignSelf: 'center' }}>
                                {`Progress: ${Math.round(progressValue)} %`}
                            </Text>
                            <View style={{ width: wp('60%'), alignSelf: 'center' }}>
                                <ProgressView
                                    progressTintColor={COLORS.primary}
                                    trackTintColor={COLORS.black}
                                    progress={progressValue / 100}
                                />
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        // </KeyboardAwareScrollView>
    );
};
const styles = StyleSheet.create({
    main: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: COLORS.white
    },
    headerView: {
        width: wp('100%'),
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: COLORS.grayniteGray,
        borderBottomWidth: 0.5
    },
    logoutText: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
    heading: {
        width: wp('85%'),
        alignSelf: 'center',
        fontSize: hp('2.5%'),
        marginTop: hp('2%'),
        color: COLORS.primary,
        fontFamily: Font.bold
    },
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
        alignSelf: 'center'
    },
    emailInput: {
        marginTop: hp('1%')
    },
    videoView: {
        width: wp('85%'),
        height: hp('35%'),
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.offBlue,
        marginTop: hp('4%'),
        borderRadius: 8,
    },
    videoViewOne: {
        width: wp('85%'),
        height: hp('35%'),
        alignSelf: 'center',
        backgroundColor: COLORS.offBlue,
        marginTop: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    postBTn: {
        backgroundColor: COLORS.primary,
        marginBottom: hp('4%')
    },
    recordBtn: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.blue,
        alignSelf: 'center'
    }
})
export default ReportIssue;
