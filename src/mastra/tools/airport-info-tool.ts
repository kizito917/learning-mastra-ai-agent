// External imports
import { createTool } from "@mastra/core";
import { z } from "zod";

// Internal imports
import { formattedAirportAndFlightRouteSchema } from "../schema/airport";
import { 
    getAirportDailyRoutesAndFlight, 
    getDelayInfo, 
    getAllAirportsOfSpecificLocation 
} from "../controllers/airport";

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

export const retrieveAirportsByLocationTool = createTool({
    id: 'retrieve-airports-by-location',
    description: 'Retrieve all available airports of a specific location',
    inputSchema: z.object({
        latitude: z.string().min(1),
        longitude: z.string().min(1)
    }),
    execute: async ({ context }) => {
        return await getAllAirportsOfSpecificLocation(context.latitude, context.longitude)
    }
})