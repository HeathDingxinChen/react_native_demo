import {configureStore} from "@reduxjs/toolkit";
import airportMetaDataReducer from "@/store/airportsMetaDataSlice";
import citySelectReducer from "@/store/citySelectSlice";
import odPairMetaDataSlice from "@/store/odPairMetaDataSlice";


export const store = configureStore({
    reducer: {
        airportMetaData: airportMetaDataReducer,
        odPairMetaData: odPairMetaDataSlice,
        citySelect: citySelectReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch