// External imports
import { createTool } from "@mastra/core";
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { join } from "path";

export const icaoRetrievalTool = createTool({
    id: 'get-airport-icao',
    description: 'Get an airport ICAO code',
    inputSchema: z.object({
        airportName: z.string()
    }),
    outputSchema: z.object({
        status: z.number(),
        icao: z.string().nullable()
    }),
    execute: async ({ context }) => {
        return await getIcaoCode(context.airportName)
    }
})

// Function to parse csv data
async function parseAirports(csvFilePath: string) {
    try {
        const data = await readFile(csvFilePath, 'utf8');
        
        return data
            .trim()
            .split('\n')
            .map(line => {
                const [name, iata, icao] = line.split(',');
                return {
                    name: name.trim(),
                    iata: iata === '\\N' ? null : iata.trim(),
                    icao: icao.trim()
                };
            });
    } catch (error: any) {
        console.log(error);
        throw new Error('Error reading CSV file:', error);
    }
}

const getIcaoCode = async (airportName: string) => {
    const csvPath = join(process.cwd(), 'utils/airport-list.csv');
    console.log("================== CSV PATH ==================", csvPath);
    const airports = await parseAirports(csvPath);
    const retrievedAirport = await airports.filter((airport) => airport.name === airportName || airport.name.includes(airportName));
    if (!retrievedAirport || retrievedAirport.length <= 0) {
        return {
            status: 404,
            icao: null
        }
    }

    return {
        status: 200,
        icao: retrievedAirport[0].icao
    }
}