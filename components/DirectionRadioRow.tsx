import {Pressable, StyleSheet, Text, View} from 'react-native'

type PropTypes = {
    directionType: 0 | 1
    activeDirection: number;
    onPressDirectionChange: (value: number) => void;
};

function DirectionRadioRow({directionType, activeDirection, onPressDirectionChange}: PropTypes) {
    return (
        <View style={[styles.radioSelectRow, {
            marginBottom: 10,
        }]}>
            <View style={directionType === 0 && styles.centerBorder}>
                <Pressable style={[styles.radioRow,
                ]} onPress={() => {
                    onPressDirectionChange(directionType)
                }}>
                    <View style={styles.circleOuter}>
                        {activeDirection === directionType && <View style={styles.circleInner}></View>}
                    </View>
                    {directionType === 0 && <Text style={[styles.directionFont,]}>Arriving</Text>}
                    {directionType === 1 && <Text style={[styles.directionFont,]}>Departing</Text>}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centerBorder: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: 'rgb(191,191,191)',
        borderStyle: "solid",
    },
    radioSelectRow: {
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(191,191,191)',
        borderStyle: "solid",
        height: 40,
        flexDirection: 'row',
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: "center",

    },
    directionFont: {
        fontSize: 16,
        marginLeft: 10,
        color: 'rgb(133,131,131)',

    },

    circleOuter: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: 'rgb(191,191,191)',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleInner: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: 'rgb(50,115,140)',
    },
})

export default DirectionRadioRow;