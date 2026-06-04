import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setDate} from "@/store/searchFlightParamSlice";
import dayjs from "dayjs";

type Props = {

    clickCheckStatusButton: () => void
}

function TimeSelectButton({clickCheckStatusButton}: Props) {

    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state.searchFlightParam.data.date);


    const dateList = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return date;
    })

    const dateLabelList = dateList.map(date => {
        return {
            dateStr: date.toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit',}),
            weekdayStr: date.toLocaleDateString('en-GB', {weekday: 'short'}),
            dayStr: date.toLocaleDateString('en-GB', {day: '2-digit',}),
            date: date.toISOString()
        };
    })

    function compareDate(date1: string | null, date2: string | null) {
        if (!date1 || !date2) return false
        return dayjs(date1).format("YYYY-MM-DD") === dayjs(date2).format("YYYY-MM-DD")
    }

    return (
        <View>
            <View style={[styles.dateContainer]}>
                {dateLabelList.map((item, index) => {
                    return (<TouchableOpacity
                        style={[styles.dateButton, compareDate(selectedDate.date, item.date) && styles.highLightDateButton]}
                        key={index} onPress={() => {
                        dispatch(setDate(item))
                        clickCheckStatusButton();
                    }}>
                        <Text
                            style={[styles.dateText, , compareDate(selectedDate.date, item.date) && styles.highLightDateText]}>{item.weekdayStr}</Text>
                        <Text
                            style={[styles.dateText, , compareDate(selectedDate.date, item.date) && styles.highLightDateText]}>{item.dayStr}</Text>
                    </TouchableOpacity>)
                })}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    dateContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    dateButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50
    },
    highLightDateButton: {
        backgroundColor: 'rgb(40,99,99)'
    },
    highLightDateText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white"
    },
    dateText: {
        color: 'rgb(78 78 78)',
        fontSize: 12
    },
})

export default TimeSelectButton;