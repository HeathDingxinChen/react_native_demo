import {Text, StyleSheet, View, Pressable, Dimensions} from 'react-native'
import React, {useState} from 'react'



type Props = {
    activeTab: number;
    onActiveTabChange: (value: number) => void;
};

export default function SearchTab({activeTab, onActiveTabChange}: Props) {
    function onPressSearchTypeTab(value: number) {
        onActiveTabChange(value)
    }

    return (
        <View style={styles.searchTabContainer}>
            <View style={[styles.searchTabBox, activeTab === 0 ? styles.activeTab : styles.inactiveTab]}>
                <Pressable style={[styles.searchTab]} onPress={() => onPressSearchTypeTab(0)}>
                    <Text style={[styles.searchTabText,
                        activeTab === 1 && styles.highLightFont
                    ]}>By city</Text>
                </Pressable>
            </View>
            <View style={[styles.searchTabBox, activeTab === 1 ? styles.activeTab : styles.inactiveTab]}>
                <Pressable style={[styles.searchTab]} onPress={() => onPressSearchTypeTab(1)}>
                    <Text style={[styles.searchTabText,
                        activeTab === 0 && styles.highLightFont
                    ]}>By flight number</Text>
                </Pressable>
            </View>

        </View>
    )

}


const styles = StyleSheet.create({
    searchTabContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        flexDirection: 'row'
    },
    searchTabBox: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    searchTab: {
        backgroundColor: 'white',
        borderRightColor: 'rgb(231,231,231)',
        borderRightWidth: 2,
        height: 32,
        justifyContent: "center",
        alignItems: 'center',

    },
    activeTab: {
        borderBottomColor: 'rgb(163,152,125)',
        borderBottomWidth: 4,
    },
    inactiveTab: {
        borderBottomColor: 'rgb(231,231,231)',
        borderBottomWidth: 4,
    },
    highLightFont: {
        color: 'rgb(94,146,166)',
    },
    highLightButton: {
        borderBottomColor: 'rgb(40,125,152)',
        borderBottomWidth: 4,
    },

    searchTabText: {
        fontSize: 16,
        fontWeight: '500',
    },

})
