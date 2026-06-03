import {StyleSheet, Text, View} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {Flight} from "@/types/flightStatusResponse"
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useEffect} from "react";
import {fetchAirportsMetaData} from "@/store/airportsMetaDataSlice";

type PropTypes = {
    availableFlightList: {
        flights?: Flight[]
    }

};


function FlightDetail({availableFlightList}: PropTypes) {
    const {flights} = availableFlightList

    const dispatch = useAppDispatch();

    const airportMetaDataMap = useAppSelector((state) => state.airportMetaData.airportMetaDataMap)

    useEffect(() => {
        if (Object.keys(airportMetaDataMap).length === 0) {
            dispatch(fetchAirportsMetaData())
        }
    }, []);

    function buildTips(item: Flight) {
        let placeholders = item.legs[0]?.descriptionMsg?.placeholders;

        if (placeholders.includes('{{ATA}}')) {
            placeholders = placeholders.replace('{{ATA}}', getTimeFromDate(item.legs[0].arrival.latestUpdatedTime.date))
        }
        if (placeholders.includes('{{ETD}}')) {
            placeholders = placeholders.replace('{{ETD}}', getTimeFromDate(item.legs[0].departure.latestUpdatedTime.date))
        }
        return placeholders
    }

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
                    <View key={index}>
                        <View
                            style={[styles.flightTipsContainer,
                                item.statusCondition !== 'GOOD' && styles.alertBackGroundColor,
                                item.statusCondition === 'GOOD' && styles.normalBackGroundColor
                            ]}>
                            <Text
                                style={[styles.flightTips,
                                    item.statusCondition !== 'GOOD' && styles.alertTextColor,
                                    item.statusCondition === 'GOOD' && styles.normalBackGroundColor
                                ]}>{buildTips(item)}</Text>
                        </View>
                        <View
                            style={[styles.flightDetailContainer,]}
                        >

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
                                    <Text style={styles.cityTitle}>{getCityName(item.departure.airport)}</Text>
                                </View>
                            </View>
                            <View style={styles.flightNumberContainer}>
                                <Text
                                    style={styles.flightNumber}>{item.operatingAirline}{item.operatingFlightNo}</Text>
                                <Text style={styles.flightNumber}>Operated by Cathay Pacific</Text>
                            </View>
                            {item.legs?.map((legItem, legIndex) => {

                                return (
                                    <View key={legIndex}>
                                        <View style={styles.flightDateTimeContainer}>
                                            <View>
                                                <Text
                                                    style={styles.flightDetailMarkLeft}>DEPARTS</Text>
                                                <Text
                                                    style={styles.flightDateLeft}>{getDateFromDate(legItem.departure.scheduleTime.date)}</Text>
                                                <Text
                                                    style={styles.flightTimeLeft}>{getTimeFromDate(legItem.departure.scheduleTime.date)}</Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={styles.flightDetailMarkRight}>ARRIVES</Text>
                                                <Text
                                                    style={styles.flightDateRight}>{getDateFromDate(legItem.arrival.scheduleTime.date)}</Text>
                                                <Text
                                                    style={styles.flightTimeRight}>{getTimeFromDate(legItem.arrival.scheduleTime.date)}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.flightDateTimeContainer}>
                                            <View>
                                                <Text
                                                    style={styles.flightDetailMarkLeft}>{legItem.departure.latestUpdatedTime.source}</Text>
                                                <Text
                                                    style={styles.flightEstimateTimeLeft}>{getTimeFromDate(legItem.departure.latestUpdatedTime.date)}</Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={styles.flightDetailMarkRight}>{legItem.arrival.latestUpdatedTime.source}</Text>
                                                <Text
                                                    style={styles.flightEstimateTimeRight}>{getTimeFromDate(legItem.arrival.latestUpdatedTime.date)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.terminalMarkContainer}>
                                            <Text
                                                style={styles.terminalMark}>{` ${legItem.departure.terminal ?? '--'} `}</Text>
                                            <Text
                                                style={styles.terminalMark}>{` ${legItem.arrival.terminal ?? '--'} `}</Text>
                                        </View>


                                    </View>)
                            })}

                        </View>
                    </View>
                )
            })}
        </View>
    )
        ;
}


const styles = StyleSheet.create({
    flightTipsContainer: {
        marginTop: 15,
        height: 30,
        justifyContent: "center",
        alignItems: "center",

    },
    alertBackGroundColor: {
        backgroundColor: 'rgb(228,189,193)'
    },
    alertTextColor: {
        color: 'rgb(175,59,64)'
    },
    normalBackGroundColor: {
        backgroundColor: 'rgb(189 228 209)'
    },
    normalTextColor: {
        color: 'rgb(59 175 74)'
    },
    flightTips: {},

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
    flightDetailMarkLeft: {
        textAlign: 'left',
        color: 'rgb(80 78 78)',

    },
    flightDetailMarkRight: {
        textAlign: 'right',
        color: 'rgb(80 78 78)',

    },
    flightTimeLeft: {
        textAlign: 'left',
        fontSize: 20
    },
    flightTimeRight: {
        textAlign: 'right',
        fontSize: 20
    },
    flightEstimateTimeLeft: {
        textAlign: 'left',
        color: 'black',
        fontSize: 30
    },
    flightEstimateTimeRight: {
        textAlign: 'right',
        color: 'black',
        fontSize: 30
    },

    flightDateLeft: {
        textAlign: 'left',
        fontSize: 20
    },
    flightDateRight: {
        textAlign: 'right',
        fontSize: 20
    },
    flightNumber: {},
    flightIcon: {
        textAlign: 'center',
        flex: 1,
        transform: [{translateY: 10}],
        backgroundColor: '#fff',
    },

})

export default FlightDetail;