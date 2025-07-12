import { createTool } from "@mastra/core";
import { z } from "zod";

export const flightTrackerTool = createTool({
    id: 'get-flight-info',
    description: 'Get flight information',
    inputSchema: z.object({
        flightNumber: z.string()
    }),
    execute: async ({ context }) => {
        return await getRecentFlightInfo(context.flightNumber)
    }
})

export const flightDelaysInfoTool = createTool({
    id: 'get-flight-delay-info',
    description: 'get flight dey information by flight number',
    inputSchema: z.object({
        flightNumber: z.string()
    }),
    execute: async ({ context }) => {
        return await getFlightDelayInfo(context.flightNumber)
    }
})

const getRecentFlightInfo = async (flightNumber: string) => {
    console.log("================= CALLING THE FLIGHT STATUS/INFO TOOL =========", flightNumber);
    const url = `${process.env.AERODATABOX_API_BASE_URL}/flights/number/${flightNumber}?withAircraftImage=false&withLocation=false`;
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
        console.log(result[0]);

        return result[0];
    } catch (error) {
        return { }
    }
}

const getFlightDelayInfo = async (flightNumber: string) => {
    console.log("================= CALLING THE FLIGHT DELAY INFO TOOL =========", flightNumber);
    const url = `${process.env.AERODATABOX_API_BASE_URL}/flights/${flightNumber}/delays`;
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
        return { }
    }
}
