import {Pressable, StyleSheet, Text, View} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {Flight} from "@/types/flightStatusResponse"
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useEffect} from "react";
import {fetchAirportsMetaData} from "@/store/airportsMetaDataSlice";
import {router} from "expo-router";
import {setItem} from "@/store/selectedFlight";

type PropTypes = {
    availableFlightList: {
        flights?: Flight[]
    }

};


function FlightStatus({availableFlightList}: PropTypes) {
    const {flights} = availableFlightList

    const dispatch = useAppDispatch();

    const airportMetaDataMap = useAppSelector((state) => state.airportMetaData.airportMetaDataMap)

    useEffect(() => {
        if (Object.keys(airportMetaDataMap).length === 0) {
            dispatch(fetchAirportsMetaData())
        }
    }, []);


    function getCityName(airportCode: string) {
        const airportMetaDataElement = airportMetaDataMap[airportCode];
        return airportMetaDataElement.airport.defaultName
    }

    function getTimeFromDate(dateStr: string) {
        if (dateStr === '') return '--:--'
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})
    }

    function getDateFromDate(dateStr: string) {
        if (dateStr === '') return '--:--'
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit', month: 'short'})
    }

    return (
        <View>
            {flights?.map((item, index) => {
                return (
                    <Pressable key={index} onPress={() => {
                        dispatch(setItem(item))
                        router.push({
                            pathname: '/flight-detail',
                        })
                    }}>
                        <View style={[styles.flightDetailContainer,]}>
                            <View style={styles.flightMarkContainer}>
                                <View style={styles.airportMark}>
                                    <Text
                                        style={styles.airportCode}>{item.departure.airport ?? '--'}</Text>
                                    <Text style={styles.cityTitle}>{getCityName(item.departure.airport)}</Text>
                                </View>
                                <Ionicons style={styles.flightIcon} name="airplane" size={35}
                                          color="rgb(176,165,139,0.7)"/>
                                <View style={styles.airportMark}>
                                    <Text
                                        style={styles.airportCode}>{item.arrival.airport ?? '--'}</Text>
                                    <Text style={styles.cityTitle}>{getCityName(item.arrival.airport)}</Text>
                                </View>
                            </View>
                            <View style={styles.flightNumberContainer}>
                                <Text
                                    style={styles.flightNumber}>{item.operatingAirline}{item.operatingFlightNo}</Text>
                                <Text style={styles.flightNumber}>Operated by Cathay Pacific</Text>
                            </View>
                        </View>
                    </Pressable>
                )
            })}
        </View>
    )
        ;
}


const styles = StyleSheet.create({
    normalBackGroundColor: {
        backgroundColor: 'rgb(189 228 209)'
    },
    normalTextColor: {
        color: 'rgb(59 175 74)'
    },
    flightMarkContainer: {
        paddingHorizontal: "auto",
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    cityTitle: {
        textAlign: "center"
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

    flightDetailContainer: {
        width: '100%',
        marginBottom: 15,
        marginTop: 15,
        paddingHorizontal: 25,
        paddingVertical: 25,
        backgroundColor: '#fff',

    },
    terminalMark: {
        color: 'white',
        backgroundColor: 'rgb(122,115,98)'
    },
    airportMark: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: 'white',
    },
    airportCode: {
        fontSize: 45,
        textAlign: "center",
        fontWeight: '300',
        color: 'rgb(57,57,57)',
    },
    terminalMarkContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    flightDateTimeContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    flightNumber: {},
    flightIcon: {
        textAlign: 'center',
        flex: 1,
        transform: [{translateY: 10}],
        backgroundColor: '#fff',
    },

})

export default FlightStatus;