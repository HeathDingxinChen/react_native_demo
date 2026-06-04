import {Pressable, StyleSheet, Text} from 'react-native'
import {router} from "expo-router";
import {useAppSelector} from "@/store/hooks";

type PropTypes = {
    cityDirectionType: 'departure' | 'arrival'

};

function CitySelectRow({cityDirectionType}: PropTypes) {


    const departureAirport = useAppSelector((state) => state.searchFlightParam.data.departure);
    const arrivalAirport = useAppSelector((state) => state.searchFlightParam.data.arrival);


    return (

        <Pressable style={[styles.citySelectRow]} onPress={() => router.push({
            pathname: '/city-select',
            params: {
                cityDirectionType: cityDirectionType
            }
        })}><Text
            style={styles.citySelectText}>
            {cityDirectionType === 'departure' ? (departureAirport.selectedAirportName ?? 'Enter departure city') : (arrivalAirport.selectedAirportName ?? 'Enter arrival city')}
        </Text></Pressable>

    );
}

const styles = StyleSheet.create({
    citySelectRow: {
        flex: 1,
        marginBottom: 3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 15,
    },
    citySelectText: {
        color: 'rgb(191,191,191)',
        fontSize: 16,
        fontWeight: '500',
    },

})

export default CitySelectRow;