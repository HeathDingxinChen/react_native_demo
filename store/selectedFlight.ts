import {createSlice} from "@reduxjs/toolkit";
import {Flight} from "@/types/flightStatusResponse";


const selectedFlight = createSlice({
    name: 'selectedFlight',
    initialState: {
        item: {} as Flight
    },
    reducers: {
        setItem(state, action) {
            state.item = action.payload
        }
    }

})


export const {setItem} = selectedFlight.actions
export default selectedFlight.reducer