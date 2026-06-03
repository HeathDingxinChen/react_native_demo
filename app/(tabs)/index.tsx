import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    Pressable,
    Linking,
    TextInput,
    FlatList,
    ActivityIndicator, Alert
} from 'react-native';
import {useState} from "react";

import SearchTab from "@/components/SearchTab";
import CitySelectRow from "@/components/CitySelectRow";
import DirectionRadioRow from "@/components/DirectionRadioRow";
import CheckStatusButton from "@/components/CheckStatusButton";
import TimeSelectButton from "@/components/TimeSelectButton";
import FlightDetail from "@/components/FlightDetail";
import {FlightStatusResponse} from "@/types/flightStatusResponse";
import {getFlightStatus} from "@/api/client";
import dayjs from "dayjs";
import {useAppSelector} from "@/store/hooks";

export default function SearchScreen() {


    function onPressDirectionButton(value: 'A' | 'D') {
        setDirection(value)
    }

    // arriving = 0 departing = 1
    const [direction, setDirection] = useState<'A' | 'D'>('A')
    const [showDates, setShowDates] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<{
        dateStr: string
        date: Date
    }>({
        dateStr: new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }),
        date: new Date()
    })
    // by city = 0  by flight number = 1
    const [activeTab, setActiveTab] = useState(0)

    const [availableFlightList, setAvailableFlightList] = useState<FlightStatusResponse>({} as FlightStatusResponse)


    const departureAirport = useAppSelector((state) => state.citySelect.departure);
    const arrivalAirport = useAppSelector((state) => state.citySelect.arrival);

    function clickCheckStatusButton() {
        console.log(dayjs(selectedDate.date).format("YYYY-MM-DD"))
        console.log(direction)
        console.log(departureAirport.selectedAirportCode)
        console.log(arrivalAirport.selectedAirportCode)

        if (!departureAirport.selectedAirportCode || !arrivalAirport.selectedAirportCode || loading) return
        setLoading(true)
        getFlightStatus(dayjs(selectedDate.date).format("YYYY-MM-DD"), direction, departureAirport.selectedAirportCode, arrivalAirport.selectedAirportCode,)
            .then((result) => {
                setAvailableFlightList(result)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
                Alert.alert(err.message)
            })
    }

    return (

        <View style={styles.container}>

            <SearchTab activeTab={activeTab} onActiveTabChange={setActiveTab}/>
            <View style={styles.contentContainer}>
                {activeTab === 0 && (<View style={{flex: 1}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            <Text style={{
                                height: 32,
                                fontSize: 16,
                                paddingLeft: 5,
                                marginTop: 15,
                                color: 'rgb(130,130,130)',
                                fontWeight: '400'
                            }}>Please enter your search below</Text>
                            <View style={[styles.citySelectContainer]}>
                                <CitySelectRow cityDirectionType='departure'/>
                                <CitySelectRow cityDirectionType='arrival'/>
                            </View>
                            <View style={styles.directionAndDateContainer}>
                                <View style={[styles.directionSelectContainer]}>
                                    <DirectionRadioRow directionType={'A'} activeDirection={direction}
                                                       onPressDirectionChange={setDirection}></DirectionRadioRow>
                                    <DirectionRadioRow directionType={'D'} activeDirection={direction}
                                                       onPressDirectionChange={setDirection}></DirectionRadioRow>

                                </View>
                                <TimeSelectButton showDates={showDates}
                                                  selectedDate={selectedDate}
                                                  onShowDatesChange={setShowDates}
                                                  onSelectedDateChange={setSelectedDate}></TimeSelectButton>


                            </View>
                            <View style={styles.tipsContainer}>
                                <Text style={styles.tipsText}>
                                    You can search flights from the past four days, or plan three days ahead. For other
                                    dates,
                                    please see our
                                </Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={() => Linking.openURL('https://www.cathaypacific.com')}>
                                    timetable online
                                </Text>
                            </View>

                            <CheckStatusButton clickCheckStatusButton={clickCheckStatusButton}></CheckStatusButton>
                            {(availableFlightList.flights?.length ?? 0) > 0 &&
                                <FlightDetail availableFlightList={availableFlightList}></FlightDetail>}
                        </ScrollView>


                    </View>
                )}
                {activeTab === 1 && (<View style={{flex: 1}}>
                        <ScrollView>
                            <Text style={{
                                height: 32,
                                fontSize: 16,
                                paddingLeft: 5,
                                marginTop: 15,
                                color: 'rgb(130,130,130)',
                                fontWeight: '400'
                            }}>Please enter your search below</Text>
                            <View style={[styles.flightNumberContainer]}>
                                <TextInput style={styles.flightNumberInput} placeholder={"Flight Number"}></TextInput>
                            </View>
                            <View style={styles.directionAndDateContainer}>
                                <TimeSelectButton showDates={showDates}
                                                  selectedDate={selectedDate}
                                                  onShowDatesChange={setShowDates}
                                                  onSelectedDateChange={setSelectedDate}></TimeSelectButton>
                            </View>
                            <View style={styles.tipsContainer}>
                                <Text style={styles.tipsText}>
                                    You can search flights from the past four days, or plan three days ahead. For other
                                    dates,
                                    please see our
                                </Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={() => Linking.openURL('https://www.cathaypacific.com')}>
                                    timetable online
                                </Text>
                            </View>
                        </ScrollView>
                        <CheckStatusButton clickCheckStatusButton={clickCheckStatusButton}></CheckStatusButton>

                    </View>
                )
                }

            </View>
            {loading &&
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="rgb(40,99,99)">

                    </ActivityIndicator>
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    flightNumberInput: {
        paddingLeft: 10,
    },
    flightNumberContainer: {
        backgroundColor: 'white',
        marginTop: 15,
        justifyContent: "center",
        height: 50
    },


    tipsContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },

    tipsText: {
        color: 'rgb(133,131,131)',
        fontWeight: '400',
    },
    linkText: {
        color: 'rgb(40,125,152)',
        fontWeight: '400',
    },


    directionSelectContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 5,
        paddingTop: 10,
    },


    citySelectContainer: {
        height: 140,
    },
    directionAndDateContainer: {
        marginTop: 15
    },


});
