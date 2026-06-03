import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native'

type PropTypes = {
    clickCheckStatusButton: () => void
};

function CheckStatusButton({clickCheckStatusButton}: PropTypes) {
    return (
        <View style={styles.checkStatusContainer}>
            <Pressable style={styles.checkStatusButton} onPress={() => {
                clickCheckStatusButton()
            }}>
                <Text style={styles.checkStatusText}>Check status</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    checkStatusContainer: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        height: 100,
        marginTop: 10
    },
    checkStatusButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgb(216,216,216)'
    },
    checkStatusText: {
        color: 'rgb(99,99,99)',
        fontSize: 20,
    },
})

export default CheckStatusButton;