import {combineReducers, configureStore} from "@reduxjs/toolkit";
import airportMetaDataReducer from "@/store/airportsMetaDataSlice";
import searchFlightReducer from "@/store/searchFlightParamSlice";
import odPairMetaDataReducer from "@/store/odPairMetaDataSlice";
import {persistReducer, persistStore} from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage";
import selectedFlighteducer from "@/store/selectedFlight";


const rootReducer = combineReducers(
    {
        airportMetaData: airportMetaDataReducer,
        odPairMetaData: odPairMetaDataReducer,
        searchFlightParam: searchFlightReducer,
        selectFlight: selectedFlighteducer

    }
);

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['airportMetaData', 'odPairMetaData']
}


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    }
})


export type RootState = ReturnType<typeof store.getState>
export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch