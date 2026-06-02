import {StyleSheet, Text, View, ScrollView, Dimensions, Pressable, Linking, TextInput, FlatList} from 'react-native';
import {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons"

import {router, useLocalSearchParams} from "expo-router";
import SearchTab from "@/components/SearchTab";
import CitySelectRow from "@/components/CitySelectRow";
import DirectionRadioRow from "@/components/DirectionRadioRow";
import CheckStatusButton from "@/components/CheckStatusButton";
import TimeSelectButton from "@/components/TimeSelectButton";


export default function SearchScreen() {


    function onPressDirectionButton(value: number) {
        setDirection(value)
    }

    // arriving = 0 departing = 1
    const [activeDirection, setDirection] = useState(0)
    const [showDates, setShowDates] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))
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


    const [avaliableFlightList, setAvaliableFlightList] = useState<{
        flights?: {
            operatingAirline?: string
            operatingFlightNo?: string
            codeShareFlights?: string
            status?: string
            statusCondition?: string
            scenarioID?: string
            isRerouted?: boolean
            noOfStop?: number
            departure?: {
                latestUpdatedTime: {
                    source: string
                    date: string
                },
                airport: string,
                dateDiff: number,
            },
            arrival?: {
                latestUpdatedTime: {
                    source: string
                    date: string
                },
                airport: string,
                dateDiff: number,
            },
        }[]
    }>({})

    useEffect(() => {
        fetch('https://bff-flightstatus-cxmobile-t0.rosa1.ct1.cathaypacific.com/flightstatus-mobile/v1/flightstatus/2026-06-01/D')
            .then(res => res.json())
            .then((result) => {setAvaliableFlightList(result)})
            .catch(err => console.log(err))
    }, []);

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

            {activeTab === 0 && (<View style={{flex: 1}}>
                    <ScrollView style={[styles.scrollViewContent]}
                                contentContainerStyle={{
                                    padding: 15

                                }}>
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
                                <DirectionRadioRow directionType={0} activeDirection={activeDirection}
                                                   onPressDirectionChange={setDirection}></DirectionRadioRow>
                                <DirectionRadioRow directionType={1} activeDirection={activeDirection}
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
                    </ScrollView>
                    <CheckStatusButton></CheckStatusButton>
                </View>
            )}


            {activeTab === 1 && (<View style={{flex: 1}}>
                    <ScrollView style={[styles.scrollViewContent]}
                                contentContainerStyle={{
                                    padding: 15

                                }}>
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

                    <View></View>

                    {/*<FlatList data={avaliableFlightList} renderItem={(itme)=>(*/}
                    {/*<View>*/}
                    {/*    */}
                    {/*</View>)}></FlatList>*/}

                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column'
    },
    flightNumberInput: {
        paddingLeft: 10,
    },
    flightNumberContainer: {
        backgroundColor: '#fff',
        justifyContent: "center",
        height: 50
    },

    tipsContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },

    scrollViewContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'rgb(240,240,240)',
        flex: 1,

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
