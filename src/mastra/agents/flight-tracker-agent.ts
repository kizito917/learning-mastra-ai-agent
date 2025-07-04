import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { Agent, MastraVector } from "@mastra/core";
import { PostgresStore, PgVector } from '@mastra/pg';
import { flightTrackerTool } from "../tools/flight-agent-tool";

// PostgreSQL connection details
const host = process.env.DB_HOST || '';
const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USER || '';
const database = process.env.DB_NAME || '';
const password = process.env.DB_PASSWORD || '';
const connectionString = process.env.DB_URI || '';

const memory = new Memory({
    storage: new PostgresStore({
        host,
        port: Number(port),
        user,
        database,
        password,
        ssl: {
            rejectUnauthorized: false
        }
    })
});

export const flightTrackerAgent = new Agent({
    name: 'Flight Tracker Agent',
    instructions: `
        You are a helpful flight tracker assistant. Your job is to request for a flight number from a user and fetch all information about the flight/airline if not yet provided by the user

        If a user sends any random message that doesn't go inline with your context, remind them that you are an ai assistant that whose job is to check for informations about their flight.

        Your primary function is to retrieve information about a particular flight when a user provides you with the flight number

        You are to make use of the flightTrackerTool to fetch information about a user flight(when they provide you the flight number) and return the retrieved data.

        Return the most important part of the information which are flight name, departure, arrival, flight type, scheduled date, if its a cargo plane, and any other information you feel a user should have. make sure the result returned to the user isn't geeky. it should be friendly and attractive to read
    `,
    model: openai('gpt-4o-mini'),
    tools: { flightTrackerTool },
    memory
})