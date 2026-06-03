import {configureStore} from "@reduxjs/toolkit";
import airportMetaDataReducer from "@/store/airportsMetaDataSlice";

export const store = configureStore({
    reducer: {
        airportMetaData: airportMetaDataReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch