import React, { useState, useContext, useEffect,useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, FlatList, StatusBar, TouchableOpacity, View, RefreshControl, Alert, Text, Image,Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/context';
import axios from 'axios';
import CustomEmptyCard from '../components/customEmptyCard';
import Modal from "react-native-modal";
import Moment from 'moment';
import Video from 'react-native-video';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import { ProgressView } from '@react-native-community/progress-view';


const Home = (props) => {
    const {navigation} = props;
    const { signOut } = useContext(AuthContext)
    const [loading, setLoaing] = useState(false);
    const [allData, setAllData] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [val, setVal] = useState('')
    const [_reportID, setReportID] = useState('')
    const videoPlayer = useRef(null);
    const [progressValue, setProgressValue] = useState(0);

    const toggleModal = (item) => {
        setModalVisible(!isModalVisible);
        setVal(item)
    };
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        getAllReports();
        let video = props?.route?.params?.video;
        let rptID = props?.route?.params?.id;
        let values = props?.route?.params?.values;
        setReportID(rptID);
        if (video && video?.uri.includes("http")==false) {
            saveVideoToFirebase(video,rptID,values);
            console.log(video);
        }
    }, [props?.route?.params?.refreshView])

    const saveVideoToFirebase =  (video,reportID,values) => {
       let videoName = video?.fileName;
       let splitVideoName = videoName?.split(" ");
       let finalVideoName = splitVideoName[splitVideoName?.length-1] || videoName;

       let uri = video?.uri;
       let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

       var storageRef = firebase.storage().ref(finalVideoName);
        var uploadTask = storageRef.putFile(uploadUri);

        uploadTask.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressValue(progress);

                if(progress==100)
                setReportID('');
                
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
                Alert.alert("Error uploading your video please try again")
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    updateReportURL(reportID,downloadURL,values);
                    console.log('File available at', downloadURL);
                });
            }
        );
    }

    const updateReportURL = async (reportID,videoUrl,values) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        const date = new Date();
        const _date = Moment(date).format('DD-MM-YYYY');

        let url=`https://propertyupkeepmanagement.com/api/save-report?report_id=${reportID}&title=${values.title}&date=${_date}&user_id=${userId}&file=${videoUrl}`;
        console.log(url);
        const res = await axios.post(url,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + userToken
                },
            })
            .then(res => {
                if (res?.status === 200) {
                    // alert("Your Report has successfully been updated")
                } else {
                    console.log("Error Uploading")
                }
            }
            )
            .catch(err => {
                alert("Failed to submit your Report please try again")
                console.log(err)
            })
    }

    const getAllReports = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        setLoaing(true)
        const res = await axios.get(`https://propertyupkeepmanagement.com/api/reports?user_id=${userId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
            })
            .then(res => {
                console.log("res",res);
                if (res.status === 200) {
                    setLoaing(false);
                    setAllData('')
                    let data =res?.data?.data;
                    data.sort((a, b) => a.id - b.id);
                    setAllData(data.reverse())
                    console.log(res);
                    
                } else {
                    setLoaing(false)
                    Alert.alert("Network or server Error",)
                }
            }
            )
            .catch(err => {
                setLoaing(false)
                signOut();
            }
            )
    }

    const deleteReport = async (item) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        let id = item.id
        const res = await axios.post(`https://propertyupkeepmanagement.com/api/del_report?user_id=${userId}&report_id=${id}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            },
        })
            .then(res => {
                if (res.data.status === '200') {
                    setAllData('')
                    getAllReports()
                } else {
                    Alert.alert("Server or network Error")
                }
            })
    }

    const handleNavigation = async () => {
        navigation.navigate("Report Issue")
    }

    return (
        <SafeAreaView style={styles.main}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={styles.headerView}>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={signOut}>
                    <Text style={styles.logoutText}>
                        Log Out
                    </Text>
                </TouchableOpacity>
                <Text style={styles.propertyText}>
                    At Hand
                </Text>
                <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Profile')}>
                    <FontAwesome
                        name="user-circle-o"
                        size={24}
                        color={COLORS.primary}
                        style={{ alignSelf: 'flex-end', paddingRight: wp('2.5%') }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.rowView}>
                <Text style={styles.heading}>
                    Reported issues
                </Text>
                <TouchableOpacity style={styles.btn} onPress={handleNavigation}>
                    <Text style={styles.btnText}>
                        REPORT NEW ISSUE
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:100}}>
                {
                    loading ? (
                        <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                            style={{ height: hp('80%'), justifyContent: 'center', alignSelf: 'center' }}
                        />
                    ) : (
                        <FlatList
                            data={allData}
                            keyExtractor={(item) => item.id.toString()}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getAllReports} />}
                            renderItem={({ item }) => (
                                <View style={styles.card} >
                                    <View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.titleText,{flex:1}]}>
                                                {item.title}
                                            </Text>
                                            <TouchableOpacity onPress={() => deleteReport(item)}>
                                                <MaterialCommunityIcons
                                                    name="delete-circle-outline"
                                                    size={24}
                                                    style={{ alignSelf: 'flex-end' }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.additionalHeading}>
                                            {`Reported on: ${Moment(item.date).format('DD-MM-YYYY')}`}
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleModal(item)} style={{marginVertical:5}}>
                                            <Text style={styles.titleTextOne}>
                                                View Status
                                            </Text>
                                        </TouchableOpacity>
                                        {/* {item.video === null ? (
                                            null
                                        ) : (
                                            <TouchableOpacity style={styles.playVideoView} onPress={() => navigation.navigate("Media", { type: item })}>
                                                <FontAwesome
                                                    name='play-circle-o'
                                                    size={24}
                                                    color={COLORS.blue}
                                                />
                                                <Text style={styles.playBtn}>
                                                    Play Video
                                                </Text>
                
                                            </TouchableOpacity>
                                        )} */}

                                      {item?.video  &&
                                      <View style={{flex:1,width:'100%',marginVertical:10}}>
                                        <Video
                                            paused={true}
                                            ref={videoPlayer}
                                            controls={true}
                                            resizeMode={'contain'}
                                            onFullScreen={true}
                                            fullscreen={true}
                                            source={{
                                                uri:item?.video.replace(/ /g, '%20')
                                            }}
                                            style={{height:200,width:'100%'}}
                                            volume={10}
                                        />
                                        </View>
                                        }
                                        
                                        {item.additional_note === null ? (
                                            <>
                                                <Text style={styles.additionalHeading}>
                                                    Additional Notes:
                                                </Text>
                                                <Text style={styles.notesText}>
                                                    No additional notes
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.additionalHeading}>
                                                    Additional Notes:
                                                </Text>
                                                <Text style={styles.notesText}>
                                                    {item.additional_note}
                                                </Text>
                                            </>
                                        )}
                                        {/* {(_reportID && _reportID == item.id) ?
                                        <View style={{ width: wp('90%'), height: hp('10%'), alignSelf: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 20 }}>
                                            <Text style={{ fontSize: hp('1.5%'), fontFamily: Font.medium, color: COLORS.black, alignSelf: 'center' }}>
                                                Uploading your video
                                            </Text>
                                            <Text style={{ fontSize: hp('1.5%'),paddingBottom:5, fontFamily: Font.medium, color: COLORS.primary, alignSelf: 'center' }}>
                                                {`Progress: ${Math.round(progressValue)} %`}
                                            </Text>
                                            <View style={{ width: wp('80%'), alignSelf: 'center' }}>
                                                <ProgressView
                                                    progressTintColor={COLORS.primary}
                                                    trackTintColor={COLORS.black}
                                                    progress={progressValue / 100}
                                                />
                                            </View>
                                        </View>
                                        :
                                        <View />
                                      } */}
                                    </View>
                                    {/* <View style={{ height: hp('10%'), justifyContent: 'space-evenly', }}>
                                        <TouchableOpacity onPress={() => deleteReport(item)}>
                                            <MaterialCommunityIcons
                                                name="delete-circle-outline"
                                                size={24}
                                                style={{ alignSelf: 'flex-end', marginRight: wp('5%'), }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(item)}>
                                            <Text style={styles.titleTextOne}>
                                                View Status
                                            </Text>
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                            )}
                            ListEmptyComponent={<CustomEmptyCard onPress={() => navigation.navigate('Report Issue')} />}
                        />
                    )
                }
            </View>
            <Modal
                isVisible={isModalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modalView} >
                    {
                        val.profile_pic === null && val.constructor_name === null ? (
                            <Text style={{ width: wp('80%'), textAlign: 'center', fontSize: hp('2.5%'), marginTop: hp('18%'), alignSelf: 'center', fontFamily: Font.bold, color: COLORS.white, marginLeft: wp('2.5%') }}>
                                Thank you for reporting the issue, your job is currently being processed.
                            </Text>
                        ) : (
                            <>
                                {
                                    val.profile_pic === null ? (
                                        <Image
                                            source={require('../assets/images/user.png')}
                                            style={{ height: hp('20%'), width: wp('90%'), borderTopLeftRadius: 16, borderTopRightRadius: 16, marginBottom: hp('2%') }}
                                            resizeMode="cover"
                                        />
                                    ) : <Image
                                        source={{ uri: `https://propertyupkeepmanagement.com/${val.profile_pic}` }}
                                        style={{ height: hp('20%'), width: wp('90%'), borderTopLeftRadius: 16, borderTopRightRadius: 16, marginBottom: hp('2%') }}
                                        resizeMode="cover"
                                    />
                                }
                                <View style={styles.rowViewOne}>
                                    <Text style={{ fontSize: hp('2%'), fontFamily: Font.bold, color: COLORS.white, marginLeft: wp('2.5%') }}>
                                        Contractor Name
                                    </Text>
                                    <Text style={{ fontSize: hp('1.8%'), fontFamily: Font.medium, color: COLORS.white, marginRight: wp('2.5%') }}>
                                        {val.constructor_name}
                                    </Text>
                                </View>
                                <View style={styles.rowViewOne}>
                                    <Text style={{ fontSize: hp('2%'), fontFamily: Font.bold, color: COLORS.white, marginLeft: wp('2.5%') }}>
                                        Date and Time
                                    </Text>
                                    <Text style={{ fontSize: hp('1.8%'), fontFamily: Font.medium, color: COLORS.white, marginRight: wp('2.5%') }}>
                                        {Moment(val.quote_date).format('DD-MM-YYYY')}
                                    </Text>
                                </View>
                                <View style={styles.rowViewOne}>
                                    <Text style={{ fontSize: hp('2%'), fontFamily: Font.bold, color: COLORS.white, marginLeft: wp('2.5%') }}>
                                        Status
                                    </Text>
                                    <Text style={{ fontSize: hp('1.8%'), fontFamily: Font.medium, color: COLORS.white, marginRight: wp('2.5%') }}>
                                        {val.contractor_name === null ? "Pending" : "Booked"}
                                    </Text>
                                </View>
                            </>
                        )
                    }
                </View>
            </Modal>
        </SafeAreaView >
    );
};
const styles = StyleSheet.create({
    main: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: COLORS.white
    },
    flatView: {
        marginBottom: hp('100%')
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
        width: wp('25%'),
        paddingLeft: hp('2.5%'),
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
    },
    propertyText: {
        width: wp('55%'),
        fontSize: hp('2%'),
        fontFamily: Font.bold,
        color: COLORS.black,
        alignSelf: 'center',
        textAlign: 'center',
        paddingRight: wp('5%'),
    },
    icon: {
        width: wp('10%'),
        alignSelf: 'center',
    },
    rowView: {
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: hp('2%'),
        marginBottom: hp('2%')
    },
    heading: {
        fontSize: hp('2%'),
        fontFamily: Font.bold,
        color: COLORS.primary,
        alignSelf: 'center'
    },
    btn: {
        width: wp('45%'),
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        height: hp('5%'),
        justifyContent: 'center'
    },
    btnText: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.white,
        alignSelf: 'center'
    },
    card: {
        width: wp('100%'),
        padding:10,
        // alignSelf: 'center',
        // borderBottomColor: COLORS.grayniteGray,
        // borderBottomWidth: 0.5,
        backgroundColor:'#D6DCDF',
        marginTop: hp('1.5%'),
        // flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleText: {
        width: wp('60%'),
        fontSize: hp('2%'),
        fontFamily: Font.bold,
        color: COLORS.black,
        textAlign: 'left',
    },
    titleTextOne: {
        width: wp('30%'),
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
    },
    playVideoView: {
        width: wp('30%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%')
    },
    playBtn: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.blue,
        alignSelf: 'center',
        width: wp('50%'),
        marginLeft: wp('2%')
    },
    additionalHeading: {
        fontFamily: Font.medium,
        fontSize: hp('1.8%'),
        color: COLORS.grayniteGray,
        marginTop: hp('1%'),
        width: wp('60%'),
    },
    notesText: {
        width: wp('60%'),
        textAlign: 'justify',
        fontFamily: Font.regular,
        fontSize: hp('1.6%'),
        color: COLORS.grayniteGray,
        marginBottom: hp('1%'),
    },
    container: {
        flex: 1,
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
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    modalView: {
        height: hp('40%'),
        backgroundColor: COLORS.primary,
        borderRadius: 16,
    },
    rowViewOne: {
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: hp('1%'),
    },
})
export default Home;
