import { tool } from "langchain"
import * as z from "zod"
import fs from "node:fs"

export const listarArquivos = tool(
    async () => {
        const files = fs.readdirSync('.');
        return files;
    },
    {
        name: 'ListarArquivos',
        description: ' Lista os arquivos da pasta atual'
    }
)

export const lerArquivos = tool(
    async (params) => {
        const content = fs.readFileSync(params.path, 'utf-8')
        return content;
    },
    {
        name: 'LerArquivos',
        description: 'Lê o conteúdo de um arquivo específico',
        schema: z.object({ // É como se fosse um parametro de uma função
            path: z.string().describe('O caminho do arquivo')
        })
    }
)