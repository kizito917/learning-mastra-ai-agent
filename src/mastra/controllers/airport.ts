// Internal imports
import { formatAirportAndFlightStatsResult } from "../helpers/airport";

export const getDelayInfo = async (airportIcaoCode: string) => {
    console.log("================= CALLING THE AIPORT DELAY TOOL =========", airportIcaoCode);
    const url = `${process.env.AERODATABOX_API_BASE_URL}/airports/icao/${airportIcaoCode}/delays`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.AERODATABOX_API_KEY || '',
            'x-rapidapi-host': process.env.AERODATABOX_API_HOST || ''
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        return result;
    } catch (error) {
        return { }
    }
}

export const getAirportDailyRoutesAndFlight = async (airportIcaoCode: string) => {
    console.log("================= CALLING THE AIPORT & FLIGHT DAILY ROUTE TOOL =========", airportIcaoCode);
    const url = `${process.env.AERODATABOX_API_BASE_URL}/airports/icao/${airportIcaoCode}/stats/routes/daily`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.AERODATABOX_API_KEY || '',
            'x-rapidapi-host': process.env.AERODATABOX_API_HOST || ''
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const formattedResult = await formatAirportAndFlightStatsResult(result.routes);

        return formattedResult;
    } catch (error) {
        return []
    }
}

export const getAllAirportsOfSpecificLocation = async (latitude: string, longitude: string) => {
    console.log("================= CALLING THE AIPORT SEARCH BY LOCATION TOOL =========", { latitude, longitude });
    const url = `${process.env.AERODATABOX_API_BASE_URL}/airports/search/location?lat=${latitude}&lon=${longitude}&radiusKm=50&limit=10&withFlightInfoOnly=false`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.AERODATABOX_API_KEY || '',
            'x-rapidapi-host': process.env.AERODATABOX_API_HOST || ''
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.items;
    } catch (error) {
        return []
    }
}