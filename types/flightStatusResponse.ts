export type  FlightStatusResponse = {
    flights: Flight[]
}

export type Flight = {
    operatingAirline?: string
    operatingFlightNo?: string
    codeShareFlights?: string
    status?: string
    statusCondition?: string
    scenarioID?: string
    isRerouted?: boolean
    noOfStop?: number
    departure: {
        latestUpdatedTime: {
            source: string
            date: string
        },
        airport: string,
        dateDiff: number,
    },
    arrival: {
        latestUpdatedTime: {
            source: string
            date: string
        },
        airport: string,
        dateDiff: number,
    },
    legs: Leg[]
}

export type Leg = {
    status?: string
    statusCondition?: string
    hideETAETDsection: boolean,
    isFirstLegForReroutedFlight: boolean,
    descriptionMsg: {
        key: number,
        placeholders: string,
        time: {}
    },
    adviceToPassengers: {},
    departure: {
        scheduleTime: {
            date: string
        },
        latestUpdatedTime: {
            source: string,
            date: string
        }
        airport: string,
        terminal: string,
    },
    arrival: {
        scheduleTime: {
            date: string
        },
        latestUpdatedTime: {
            source: string,
            date: string
        }
        airport: string,
        terminal: string,
    }

}



