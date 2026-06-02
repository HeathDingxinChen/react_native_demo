import {Pressable, StyleSheet, Text, View} from 'react-native'
import {router} from "expo-router";

type PropTypes = {
    directionType: 'origin' | 'destination'
    airport: {
        airportCode?: string
        airportName?: string
    }
};

function CitySelectRow({directionType, airport}: PropTypes) {
    return (
        <View style={[styles.citySelectRow]}>
            <Pressable onPress={() => router.push({
                pathname: '/city-select',
                params: {
                    directionType: directionType
                }
            })}><Text
                style={styles.citySelectText}>
                {directionType === 'origin' ? (airport.airportName ?? 'Enter departure city') : (airport.airportName ?? 'Enter arrival city')}
            </Text></Pressable>
        </View>
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