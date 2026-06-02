import {Pressable, StyleSheet, TextInput, Text, View, Dimensions, FlatList} from "react-native";
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from "react";

export default function CitySelectScreen() {

    const {directionType, departureAirportCode} = useLocalSearchParams();

    const [keyword, setKeyword] = useState('')
    const [filtedList, setFiltedList] = useState<any[]>([])
    const [oDPairList, setODPairList] = useState<Record<string, { destinations?: string[] }>>({})
    const [airportDetailList, setAirportDetailList] = useState<Record<string, any>>({})
    const [shownCitySelectList, setShownCitySelectList] = useState<any[]>([])


    useEffect(() => {
            Promise.all([
                fetch('https://t0.api.osc1.ct1.cathaypacific.com/meta-mobile/v1/airports/en_HK')
                    .then(res => res.json())
                    .catch(err => console.log(err)),
                fetch('https://t0.api.osc1.ct1.cathaypacific.com/flightstatus-mobile/v1/odPairs')
                    .then(res => res.json())
                    .catch(err => console.log(err))])
                .then(([airportDetailListResult, oDPairListResult]) => {
                    setODPairList(oDPairListResult);
                    setAirportDetailList(airportDetailListResult);
                    if (!departureAirportCode) {
                        const result = Object.entries(oDPairListResult)
                            .filter(([key]) => airportDetailListResult[key])
                            .map(([key, value]) => {
                                const airportDetail = airportDetailListResult[key]
                                return {
                                    key,
                                    ...airportDetail
                                }
                            }).map(item => {
                                return item
                            })
                        setShownCitySelectList(result)
                        setFiltedList(result)
                    } else {
                        const result = oDPairListResult[departureAirportCode as string]
                            ?.destinations
                            ?.map((key: string) => {
                                const airportDetail = airportDetailListResult[key]
                                return {
                                    key,
                                    ...airportDetail
                                }
                            }) ?? []
                        setShownCitySelectList(result)
                        setFiltedList(result)
                    }
                })
        }, []
    )


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
                               const filteredList = shownCitySelectList.filter(item => {
                                   return item.airport?.defaultName?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
                               })
                               setFiltedList(filteredList)

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
                    data={filtedList}
                    keyExtractor={(item) => item.key}
                    renderItem={({item}) => (
                        <Pressable style={styles.cityButton} onPress={() => {
                            router.navigate({
                                pathname: '/',
                                params: {
                                    directionType,
                                    selectedAirportCode: item.key,
                                    selectedAirportName: item.airport?.defaultName,
                                }
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