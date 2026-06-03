import {StyleSheet, Text, View, ScrollView, Dimensions, Pressable, Linking, TextInput, FlatList} from 'react-native';
import {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons"

import {router, useLocalSearchParams} from "expo-router";
import SearchTab from "@/components/SearchTab";
import CitySelectRow from "@/components/CitySelectRow";
import DirectionRadioRow from "@/components/DirectionRadioRow";
import CheckStatusButton from "@/components/CheckStatusButton";
import TimeSelectButton from "@/components/TimeSelectButton";
import FlightDetail from "@/components/FlightDetail";
import {FlightStatusResponse} from "@/types/flightStatusResponse";
import {getFlightStatus} from "@/api/client";
import dayjs from "dayjs";

export default function SearchScreen() {


    function onPressDirectionButton(value: 'A' | 'D') {
        setDirection(value)
    }

    // arriving = 0 departing = 1
    const [direction, setDirection] = useState<'A' | 'D'>('A')
    const [showDates, setShowDates] = useState(false)
    const [selectedDate, setSelectedDate] = useState<{
        dateStr: string
        date: Date
    }>({
        dateStr: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
        }),
        date: new Date()
    })
    // by city = 0  by flight number = 1
    const [activeTab, setActiveTab] = useState(0)

    const [origin, setOrigin] = useState<{
        airportCode?: string
        airportName?: string
    }>({})
    const [destination, setDestination] = useState<{
        airportCode?: string
        airportName?: string
    }>({})
    const {directionType, selectedAirportCode, selectedAirportName} = useLocalSearchParams();


    const [availableFlightList, setAvailableFlightList] = useState<FlightStatusResponse>({} as FlightStatusResponse)

    function clickCheckStatusButton() {
        if (!origin.airportCode || !destination.airportCode) return
        getFlightStatus(dayjs(selectedDate.date).format("YYYY-MM-DD"), direction, origin.airportCode, destination.airportCode,)
            .then((result) => {
                setAvailableFlightList(result)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (!selectedAirportCode) return
        console.log(directionType)
        if ('origin' === directionType) {
            setOrigin({
                airportCode: selectedAirportCode as string,
                airportName: selectedAirportName as string,
            })
        }
        if ('destination' === directionType) setDestination({
            airportCode: selectedAirportCode as string,
            airportName: selectedAirportName as string
        })

    }, [directionType, selectedAirportCode, selectedAirportName])

    return (
        <View style={styles.container}>
            <SearchTab activeTab={activeTab} onActiveTabChange={setActiveTab}/>
            <View style={styles.contentContainer}>
                {activeTab === 0 && (<View style={{flex: 1}}>
                        <ScrollView>
                            <Text style={{
                                height: 32,
                                fontSize: 16,
                                paddingLeft: 5,
                                color: 'rgb(130,130,130)',
                                fontWeight: '400'
                            }}>Please enter your search below</Text>
                            <View style={[styles.citySelectContainer]}>
                                <CitySelectRow directionType='origin' airport={origin}/>
                                <CitySelectRow directionType='destination' airport={destination}/>
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
                            <FlightDetail availableFlightList={availableFlightList}></FlightDetail>
                        </ScrollView>
                        {/*<CheckStatusButton></CheckStatusButton>*/}


                    </View>
                )}


                {
                    activeTab === 1 && (<View style={{flex: 1}}>
                            <ScrollView>
                                <Text style={{
                                    height: 32,
                                    fontSize: 16,
                                    paddingLeft: 5,
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

                            <CheckStatusButton></CheckStatusButton>


                        </View>
                    )
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    flightNumberInput: {
        paddingLeft: 10,
    },
    flightNumberContainer: {
        marginTop: 20,
        borderTopColor: 'black',
        borderTopWidth: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: "center",
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
