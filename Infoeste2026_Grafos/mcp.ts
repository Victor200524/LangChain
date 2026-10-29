import { MCPAdapter } from '@langchain/mcp-adapters'

export const mcps = new MCPAdapter({
    filesystem: {
        command: 'npx',
        args:[
            "-y",
            "@modelcontextprotocol/server-filesystem",
            process.cwd()
        ]
    },

    

    dias_uteis: {
        transport: 'http',
        url: 'https://randomanvil.com/mcp'
    }
});