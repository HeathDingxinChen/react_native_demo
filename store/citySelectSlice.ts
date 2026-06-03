import {createSlice} from "@reduxjs/toolkit";


const citySelect = createSlice({
    name: 'citySelect',
    initialState: {
        departure: {
            selectedAirportCode: null,
            selectedAirportName: null
        },
        arrival: {
            selectedAirportCode: null,
            selectedAirportName: null
        }
    },
    reducers: {
        setDeparture(state, action) {
            state.departure = action.payload
        },
        setArrival(state, action) {
            state.arrival = action.payload
        }
    }
})

export const {setDeparture, setArrival} = citySelect.actions

export default citySelect.reducer