import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
    servers: {
        ipinfo: {
            command: "uvx",
            args: [
                "--from",
                "git+https://github.com/briandconnelly/mcp-server-ipinfo.git",
                "mcp-server-ipinfo"
            ],
            env: {
                IPINFO_API_TOKEN: process.env.IPINFO_API_TOKEN || ""
            }
        },
    }
})