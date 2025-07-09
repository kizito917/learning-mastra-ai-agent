import { createTool } from "@mastra/core";
import { z } from "zod";
import { formattedAirportAndFlightRouteSchema } from "../schema/airport";
import { formatAirportAndFlightStatsResult } from "../helpers/airport";

export const airportDelayTrackerTool = createTool({
    id: 'get-airport-delay-info',
    description: 'Get delay information of an aiport',
    inputSchema: z.object({
        airportIcaoCode: z.string().min(4)
    }),
    execute: async ({ context }) => {
        return await getDelayInfo(context.airportIcaoCode)
    }
})

export const airportAndFlightDailyRouteTool = createTool({
    id: 'get-airport-and-flight-daily-routes',
    description: "Get daily routes of an Airport and all flights routes in the airport",
    inputSchema: z.object({
        airportIcaoCode: z.string().min(4)
    }),
    outputSchema: formattedAirportAndFlightRouteSchema,
    execute: async ({ context }) => {
        return await getAirportDailyRoutesAndFlight(context.airportIcaoCode)
    }
})

const getDelayInfo = async (airportIcaoCode: string) => {
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
        console.log(result);

        return result;
    } catch (error) {
        console.log(error);
        return { }
    }
}

const getAirportDailyRoutesAndFlight = async (airportIcaoCode: string) => {
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
        console.log(formattedResult);

        return formattedResult;
    } catch (error) {
        console.log(error);
        return []
    }
}