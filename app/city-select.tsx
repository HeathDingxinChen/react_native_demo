import {Pressable, StyleSheet, TextInput, Text, View, Dimensions, FlatList} from "react-native";
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from "react";
import {AppDispatch, RootState} from "@/store/store";
import {fetchAirportsMetaData} from "@/store/airportsMetaDataSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setArrival, setDeparture} from "@/store/citySelectSlice";
import {fetchOdPairMetaData} from "@/store/odPairMetaDataSlice";

export default function CitySelectScreen() {

    const {cityDirectionType} = useLocalSearchParams();

    const [keyword, setKeyword] = useState('')
    const [shownCitySelectList, setShownCitySelectList] = useState<any[]>([])

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
    }, []);


    const departureAirport = useAppSelector((state) => state.citySelect.departure);
    const arrivalAirport = useAppSelector((state) => state.citySelect.arrival);


    useEffect(() => {
        console.log(cityDirectionType)
        console.log(departureAirport.selectedAirportCode)
        console.log(arrivalAirport.selectedAirportCode)
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
            setShownCitySelectList(fullList)
        } else if ('departure' === cityDirectionType && arrivalAirport.selectedAirportCode) {
            console.log(55)
            const fullList = odPairMetaDataMap[arrivalAirport.selectedAirportCode as string]
                ?.destinations
                ?.map((key: string) => {
                    const airportDetail = airportMetaDataList[key]
                    return {
                        key,
                        ...airportDetail
                    }
                }) ?? []
            setShownCitySelectList(fullList)
        } else {
            const fullList = Object.entries(odPairMetaDataMap)
                .filter(([key]) => airportMetaDataList[key])
                .map(([key, value]) => {
                    const airportDetail = airportMetaDataList[key]
                    return {
                        key,
                        ...airportDetail
                    }
                }).map(item => {
                    return item
                })
            setShownCitySelectList(fullList)
        }

    }, [odPairMetaDataMap, airportMetaDataList]);

    const filteredList = shownCitySelectList.filter(item => {
        return item.airport?.defaultName?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
    })


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
                           value={keyword}
                           onChangeText={(keyword) => {

                               return setKeyword(keyword)
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
                <FlatList
                    data={filteredList}
                    keyExtractor={(item) => item.key}
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
                        </Pressable>)}>
                </FlatList>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
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