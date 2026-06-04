import {createSlice} from "@reduxjs/toolkit";

export type Direction = 'A' | 'D'
export type ActiveTab =  0| 1  //by city = 0  by flight number = 1
export type SelectedAirport = {
    selectedAirportCode: string | null;
    selectedAirportName: string | null;
};

export type DateFormat = {
    dateStr: string | null;
    date: string | null;
};


const searchFlightParamSlice = createSlice({
    name: 'searchFlightParam',
    initialState: {
        data: {
            activeTab: 0 as ActiveTab,
            direction: 'A' as Direction,
            date: {
                dateStr: new Date().toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit', month: 'short'}),
                date: new Date().toISOString()
            } as DateFormat,
            departure: {
                selectedAirportCode: null,
                selectedAirportName: null
            } as SelectedAirport,
            arrival: {
                selectedAirportCode: null,
                selectedAirportName: null
            } as SelectedAirport
        }
    },
    reducers: {
        setDate(state, action) {
            state.data.date = action.payload
        },
        setDeparture(state, action) {
            state.data.departure = action.payload
        },
        setArrival(state, action) {
            state.data.arrival = action.payload
        },
        setActiveTab(state, action) {
            state.data.activeTab = action.payload
        },
        setDirection(state, action) {
            state.data.direction = action.payload
        }

    }
})

export const {setDate,setActiveTab,setDirection, setDeparture, setArrival} = searchFlightParamSlice.actions
export default searchFlightParamSlice.reducer