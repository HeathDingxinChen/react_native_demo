import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AirportMetaDataResponse} from "@/types/airportMetaData";
import {getAirportMetaData} from "@/api/client";


export const fetchAirportsMetaData = createAsyncThunk(
    'airportDetails/fetch',
    async () => {
        return getAirportMetaData()
    })


const airportsDetailsSlice = createSlice({
    name: "airportsMetaData",
    initialState: {
        airportMetaDataMap: {} as AirportMetaDataResponse
    },
    reducers: {
        setAirportsMetaData: (state, action: PayloadAction<AirportMetaDataResponse>) => {
            state.airportMetaDataMap = action.payload
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAirportsMetaData.fulfilled, (state, action) => {
            state.airportMetaDataMap = action.payload
        })
    }

})

export const {setAirportsMetaData} = airportsDetailsSlice.actions
export default airportsDetailsSlice.reducer