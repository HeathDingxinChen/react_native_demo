import {Pressable, StyleSheet, Text, View, Modal} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {useAppDispatch} from "@/store/hooks";
import {DateFormat, setDate} from "@/store/searchFlightParamSlice";

type PropTypes = {
    showDates: boolean,
    onShowDatesChange: (value: boolean) => void,
    selectedDate: DateFormat
};

function TimeSelectButton({showDates, selectedDate, onShowDatesChange, }: PropTypes) {


    const dispatch = useAppDispatch();


    const dateList = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return date;
    })

    const dateLabelList = dateList.map(date => {
        return {
            dateStr: date.toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit', month: 'short'}),
            date: date.toISOString()
        };
    })


    return (
        <View>
            <View style={[styles.dateContainer]}>
                <Pressable style={styles.dateButton} onPress={() => {
                    onShowDatesChange(!showDates)
                }}>
                    <Text style={styles.dateText}>{selectedDate.dateStr}</Text>
                    <Ionicons style={styles.dateIcon} name="chevron-down" size={20}
                              color="rgb(50,115,140)"/>
                </Pressable>
            </View>


            <Modal visible={showDates}
                   animationType="slide"
                   transparent={true}
                   onRequestClose={() => onShowDatesChange(false)}>
                <Pressable style={styles.backdrop} onPress={() => onShowDatesChange(false)}>
                    <View style={styles.modalContent}>
                        {dateLabelList.map((item) => (
                            <Pressable key={item.dateStr} onPress={() => {
                                dispatch(setDate(item))
                                onShowDatesChange(false)
                            }}>
                                <Text style={styles.dropdownItem}>{item.dateStr}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>

            </Modal>
        </View>
    )
        ;
}

const styles = StyleSheet.create({
    dateContainer: {
        backgroundColor: 'white',

    },
    dateButton: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        height: 50
    },
    dateIcon: {
        marginRight: 10
    },
    dateText: {
        fontSize: 16,
        marginLeft: 10,
        color: 'rgb(133,131,131)',
    },
    dropdownItem: {
        fontSize: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(133,131,131)'
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,

    },
})

export default TimeSelectButton;