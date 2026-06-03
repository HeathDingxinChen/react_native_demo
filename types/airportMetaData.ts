export type AirportMetaDataResponse = Record<string, AirportMetaData>

export type AirportMetaData = {
    airport: Airport,
    country: Country,
    city: City
}


export type Airport = {
    shortName: string,
    fullName: string,
    defaultName: string,
    longitude: string,
    latitude: string,
    terminal: Terminal[]

}
export type Country = {
    code: string
    name: string,
    defaultName: string
}
export type City = {
    code: string
    name: string,
    defaultName: string

}

export type Terminal = {
    airportDepartTerminalDisplay: boolean,
    airportDepartTerminal: string,
    airportDepartTerminalValidStartDate: string,
    airportDepartTerminalValidEndDate: string,
    airportDepartTerminalDoNotDisplayWhenFlightDelay: boolean
}