import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { quoteTool } from '../tools/quote-tool';

export const quoteAgent = new Agent({
    name: 'Quote Agent',
    instructions: `
        You are a helpful quote assistant. Your job is to give random quote to uses when they request for one.

        Your primary function is to generate a quote to users when they ask you for a random quote

        You will have to use the quoteTool to fetch a random quote to return to the user
    `,
    model: openai('gpt-4o-mini'),
    tools: { quoteTool },
})