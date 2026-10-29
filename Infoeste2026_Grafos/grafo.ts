import 'dotenv/config'
import { BaseMessage } from '@langchain/core/messages'
import { END, MessagesZodMeta, START, StateGraph  } from '@langchain/langgraph'
import { withLangGraph } from '@langchain/langgraph/zod'
import { ChatOpenRouter } from '@langchain/openrouter'
import * as z from 'zod/v3'
import { createAgent } from 'langchain'
import { mcps } from './mcp.js'

const llm = new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY2,
    model: 'deepseek/deepseek-v4.1-flash-1017'
})

const tools_mcp = await mcps.listTools();

const agent = createAgent({
    model: llm,
    systemPrompt: ` 
        Você é um assitente pessoal, super simpático.
    `.trim(),
    tools: tools_mcp
})

const agent2 = createAgent({
    model: llm,
    systemPrompt: ` 
        Você é um assitente pessoal, super simpático, que sabe tudo sobre futebol.
    `.trim(),
    tools: tools_mcp
})

const State = z.object({
    messages: withLangGraph(
        z.custom<BaseMessage[]>(), MessagesZodMeta
    )
})

type State = z.infer<typeof State>

export function createGraph() {
    const workflow = new StateGraph({
        stateSchema: State // Define a resposabilidade para o proprio langchain, onde guarda quais sao as variaveis de ssao durante a sua iteração
    })

    .addNode("assistant", async (state) => {
        const result = await agent.invoke({
            messages: state.messages
        })
        const novasMessages = result.messages.slice(state.messages.length)
        return {
            messages: novasMessages
        }
    })

    .addNode("assistant2", async (state)=>{
        const result = await agent2.invoke({
            messages: state.messages
        })
        const novasMessages = result.messages.slice(state.messages.length)
        return {
            messages: novasMessages
        }
    })

    // São as sequencias de ações, de como as coisas realmente acontecem
    .addConditionalEdges(START, (state) => {
        const ultimaMessage = state.messages[state.messages.length - 1]
        const texto = typeof ultimaMessage.content === 'string' ? ultimaMessage.content : ''
        return ultimaMessage.type === 'human' && texto.toLowerCase().includes('futebol')
            ? "assistant2"
            : "assistant"
    })
    .addEdge("assistant", END)
    .addEdge("assistant2", END);

    return workflow.compile();
}

export const graph = createGraph();