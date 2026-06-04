import {Pressable, StyleSheet, TextInput, Text, View, Dimensions, FlatList, SectionList} from "react-native";
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {useEffect, useMemo, useRef, useState} from "react";
import {AppDispatch, RootState} from "@/store/store";
import {fetchAirportsMetaData} from "@/store/airportsMetaDataSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setArrival, setDeparture} from "@/store/searchFlightParamSlice";
import {fetchOdPairMetaData} from "@/store/odPairMetaDataSlice";
import {AirportMetaData, AirportMetaDataResponse} from "@/types/airportMetaData";
import groupBy from 'lodash/groupBy'
import debounce from 'lodash/debounce'

export default function CitySelectScreen() {

    const {cityDirectionType} = useLocalSearchParams();

    const [keyword, setKeyword] = useState('')
    const [debouncedKeyword, setDebouncedKeyword] = useState('')


    const debouncedSet = useMemo(() => {
        return debounce((text: string) => setDebouncedKeyword(text), 300)
    }, []);

    const textInputRef = useRef<TextInput>(null);

    const dispatch = useAppDispatch();
    const airportMetaDataList = useAppSelector((state: RootState) => {
        return state.airportMetaData.airportMetaDataMap
    })
    const odPairMetaDataMap = useAppSelector((state: RootState) => {
        return state.odPairMetaData.odPairMetaDataMap
    })

    useEffect(() => {
        if (Object.keys(airportMetaDataList).length === 0) {
            dispatch(fetchAirportsMetaData())
        }
        if (Object.keys(odPairMetaDataMap).length === 0) {
            dispatch(fetchOdPairMetaData())
        }
        textInputRef.current?.focus();

    }, []);
    useEffect(() => {
        debouncedSet.cancel()
    }, [debouncedSet]);

    const departureAirport = useAppSelector((state) => state.searchFlightParam.data.departure);
    const arrivalAirport = useAppSelector((state) => state.searchFlightParam.data.arrival);

    type AirportDetailWithKey = { key: string } & AirportMetaData

    const fullList = useMemo(() => {
        if ('arrival' === cityDirectionType && departureAirport.selectedAirportCode) {
            const fullList = odPairMetaDataMap[departureAirport.selectedAirportCode as string]
                ?.destinations
                ?.map((key: string) => {
                    const airportDetail = airportMetaDataList[key]
                    return {
                        key,
                        ...airportDetail
                    }
                }) ?? []
            return fullList
        } else if ('departure' === cityDirectionType && arrivalAirport.selectedAirportCode) {
            const fullList = odPairMetaDataMap[arrivalAirport.selectedAirportCode as string]
                ?.destinations
                ?.map((key: string) => {
                    const airportDetail = airportMetaDataList[key]
                    return {
                        key,
                        ...airportDetail
                    }
                }) ?? []
            return fullList
        } else {
            const fullList = Object.entries(odPairMetaDataMap)
                .filter(([key]) => airportMetaDataList[key])
                .map(([key, value]) => {
                    const airportDetail = airportMetaDataList[key]
                    return {
                        key: key,
                        ...airportDetail
                    }
                }).map(item => {
                    return item
                })
            return fullList
        }
    }, [odPairMetaDataMap, airportMetaDataList]);

    const filteredList = useMemo(() => {
        return fullList.filter(item => {
            return item.airport?.defaultName?.toLocaleLowerCase().includes(debouncedKeyword.toLocaleLowerCase())
        })
    }, [fullList, debouncedKeyword])


    function mapListToSections(list: AirportDetailWithKey []): { title: string, data: AirportDetailWithKey[] }[] {
        const groupByCountry: Record<string, AirportDetailWithKey[]> = {}
        list.forEach(item => {
            const country = item.country?.defaultName ?? 'Other';
            (groupByCountry[country] ??= []).push(item)
        })

        return Object.entries(groupByCountry).map(([title, data]) => ({
            title,
            data
        }))
    }

    return (
        <View style={{flex: 1}}>
            <Stack.Screen
                options={{
                    title: 'Select flights',
                    headerShown: true,
                    headerStyle: {backgroundColor: 'rgb(40,99,99)'},
                    headerBackButtonDisplayMode: 'minimal',
                    headerTintColor: '#fff',
                }}/>
            <View style={styles.textInputContainer}>
                <TextInput style={styles.textInput}
                           ref={textInputRef}
                           value={keyword}
                           onChangeText={(keyword) => {
                               setKeyword(keyword)
                               debouncedSet(keyword)

                           }}
                           placeholder="Enter Airport"
                           clearButtonMode={"while-editing"}
                           placeholderTextColor={'rgb(130 130 130 / 0.6)'}

                ></TextInput>
                <Pressable onPress={() => {
                    router.navigate({
                        pathname: '/',
                    })
                }}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>
            <View style={styles.cityListContainer}>
                <SectionList
                    sections={mapListToSections(filteredList)}
                    keyExtractor={(item, inex) => item.key}
                    renderItem={({item}) => (
                        <Pressable style={styles.cityButton} onPress={() => {

                            if ('departure' === cityDirectionType) {

                                if (departureAirport.selectedAirportCode) {
                                    dispatch(setArrival({
                                        selectedAirportCode: null,
                                        selectedAirportName: null
                                    },))
                                }

                                dispatch(setDeparture({
                                    selectedAirportCode: item.key,
                                    selectedAirportName: item.airport?.defaultName,
                                }))
                            } else if ('arrival' === cityDirectionType) {

                                if (arrivalAirport.selectedAirportCode) {
                                    dispatch(setDeparture({
                                        selectedAirportCode: null,
                                        selectedAirportName: null
                                    },))
                                }
                                dispatch(setArrival({
                                    selectedAirportCode: item.key,
                                    selectedAirportName: item.airport?.defaultName,
                                }))
                            }
                            router.navigate({
                                pathname: '/',
                            })
                        }}>
                            <Text>{item.airport?.defaultName}({item.key})</Text>
                            <Text>{item.city?.defaultName}</Text>
                        </Pressable>)}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={({section}) => (
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{section.title}</Text>
                        </View>
                    )}
                >
                </SectionList>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        backgroundColor: 'rgb(40,99,99)',
        paddingLeft: 10
    },
    titleText: {
        // fontWeight: "bold",
        color: "white"
    },
    cityListContainer: {
        flex: 1,
    },
    cityButton: {
        backgroundColor: '#fff',
        height: 60,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: 'rgb(130 130 130 / 0.6)',
        borderBottomWidth: 1
    },
    textInputContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgb(230,230,230)',
        justifyContent: "space-between",
        alignItems: "center",
    },
    textInput: {
        paddingLeft: 5,
        height: 40,
        width: Dimensions.get("window").width * 0.8,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        fontSize: 16,
        color: 'rgb(133,131,131)',
    },
    cancelButtonText: {
        marginRight: 10,
        fontSize: 16,
        color: 'rgb(50,115,140)'
    }
})