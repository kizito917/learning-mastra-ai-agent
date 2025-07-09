import { z } from "zod";
import { FlightAndAirportRoutesSchema, RouteSchema, OperatorSchema } from "../schema/airport"

export type SingleFlightRoute = z.infer<typeof RouteSchema>;
export type FlightRoutes = z.infer<typeof FlightAndAirportRoutesSchema>;
export type Operator = z.infer<typeof OperatorSchema>

const getOperatingFlights = (operators: Operator[]) => {
    const flights = operators.map((item) => {
        return item.name
    })
    
    return flights;
}

export const formatAirportAndFlightStatsResult = async (result: SingleFlightRoute[]) => {
    const formattedData = result.map((item: SingleFlightRoute) => {
        return {
            from: 'Munich Airport',
            to: item?.destination?.name || "Nil",
            averageDailyFlights: item.averageDailyFlights,
            operatingFlights: getOperatingFlights(item.operators)
        }
    })

    return formattedData;
}