import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AirportMetaDataResponse} from "@/types/airportMetaData";
import { getOdPairsMetaData} from "@/api/client";


export const fetchOdPairMetaData = createAsyncThunk(
    'odPairMetaDatafetch',
    () => {
        return getOdPairsMetaData()
    }
)


const odPairMetaDataSlice = createSlice({
    name: "airportsMetaData",
    initialState: {
        odPairMetaDataMap: {} as Record<string, { destinations?: string[] }>

    },
    reducers: {

        setOdPairMetaData: (state, action: PayloadAction<Record<string, { destinations?: string[] }>>) => {
            state.odPairMetaDataMap = action.payload
        },
    },
    extraReducers: (builder) => {

        builder.addCase(fetchOdPairMetaData.fulfilled, (state, action: PayloadAction<Record<string, {
            destinations?: string[]
        }>>) => {
            state.odPairMetaDataMap = action.payload
        })
    }

})

export const { setOdPairMetaData} = odPairMetaDataSlice.actions
export default odPairMetaDataSlice.reducer