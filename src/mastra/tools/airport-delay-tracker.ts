import { createTool } from "@mastra/core";
import { z } from "zod";

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