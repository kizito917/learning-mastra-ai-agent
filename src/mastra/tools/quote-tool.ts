import { createTool } from "@mastra/core";
import { z } from "zod";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const quoteTool = createTool({
    id: 'get-quote',
    description: 'get a random quote',
    outputSchema: z.object({
        quote: z.string()
    }),
    execute: async () => {
        return await getQuoteFromThirdPartyApi();
    }
})

const getQuoteFromThirdPartyApi = async () => {
    try {
        const url = 'https://api.quotable.io/random';
        const response = await fetch(url);
        const result = await response.json();
        console.log("RESULT", result);

        if (!result) {
            throw new Error('Unable to retrieve quote');
        }

        const quote = `${result.content} By ${result.author}` as string;
        console.log("Retrieved quote", quote);

        return { quote };
    } catch (err) {
        return { quote: '' }
    }
}