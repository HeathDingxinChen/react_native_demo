import axios from "axios";
import {AirportMetaDataResponse} from "@/types/airportMetaData";
import {FlightStatusResponse} from "@/types/flightStatusResponse";


const META_BASE_URL = 'https://t0.api.osc1.ct1.cathaypacific.com'
export const apiClient = axios.create({
    timeout: 30 * 1000
})

export const getAirportMetaData = async (language: string = 'en_HK'): Promise<AirportMetaDataResponse> => {
    const res = await apiClient.get(`${META_BASE_URL}/meta-mobile/v1/airports/${language}`);
    return res.data
}


export const getOdPairsMetaData = async (): Promise<Record<string, { destinations?: string[] }>> => {
    const res = await apiClient.get(`${META_BASE_URL}/flightstatus-mobile/v1/odPairs`);
    return res.data
}


export const getFlightStatus = async (
    dateStr: string,
    directionType: 'A' | 'D',
    origin: string,
    destination: string,
    locale: string = 'en_HK'): Promise<FlightStatusResponse> => {

    const res =
        await apiClient.get(`${META_BASE_URL}/flightstatus-mobile/v1/flightstatus/${dateStr}/${directionType}`,
            {
                params: {
                    origin, destination, locale
                }
            });
    return res.data
}