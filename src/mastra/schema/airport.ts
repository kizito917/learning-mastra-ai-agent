import { z } from 'zod';

const LocationSchema = z.object({
    lat: z.number(),
    lon: z.number()
});
  
// Schema for destination airport information
const DestinationSchema = z.object({
    icao: z.string().optional(),
    iata: z.string().optional(),
    name: z.string(),
    shortName: z.string(),
    municipalityName: z.string(),
    location: LocationSchema,
    countryCode: z.string(),
    timeZone: z.string()
});
  
// Schema for airline operators
export const OperatorSchema = z.object({
    name: z.string(),
    iata: z.string().optional(),
    icao: z.string().optional()
});
  
// Schema for individual route
export const RouteSchema = z.object({
    destination: DestinationSchema.optional(),
    averageDailyFlights: z.number(),
    operators: z.array(OperatorSchema)
});
  
// Main schema for the entire JSON structure
export const FlightAndAirportRoutesSchema = z.object({
    routes: z.array(RouteSchema)
});

export const formattedAirportAndFlightRouteSchema = z.array(z.object({
    from: z.string().min(1, "Origin airport name is required"),
    to: z.string(),
    averageDailyFlights: z.number()
        .positive("Average daily flights must be positive"),
    operatingFlights: z.array(z.string())
}));