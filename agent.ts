import 'dotenv/config';
import { ChatOpenRouter } from '@langchain/openrouter';
import { createAgent } from 'langchain';

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { listarArquivos, lerArquivos, escreverArquivo } from './tool.js';

import { mcps } from './mcp.js'

const mcp_tools = await mcps.listTools();

const llm = new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY2,
    //model: 'nvidia/nemotron-3.5-super-vl:free',
    //model: 'openai/gpt-6.1-terra',
    model: 'deepseek/deepseek-v4.1-flash-1017',
    plugins: [{id: 'web', max_result: 5}] // Permite com que o modelo acesse a internet para buscar informações em tempo real, limitado a 5 resultados.
});

const agent = createAgent({
    model: llm,
    systemPrompt:` 
        INSTRUÇÃO: Você é um assitente virtual, amigavel
    `.trim(),
    tools: mcp_tools
})

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

let context: Message[] = [];

async function callAgent(messages: Message[]) {

    const result = await agent.invoke({
        messages
    });

    const content = result.messages.at(-1)?.content;

    if (content === undefined) {
        throw new Error('O agente não retornou uma resposta.');
    }

    return typeof content === 'string' ? content : JSON.stringify(content);
}

async function sendMessage(): Promise<void> {
    const rl = readline.createInterface({ input, output });
    const message = await rl.question('Digite a sua mensagem: ');
    rl.close();

    context.push({ role: 'user', content: message });

    const response = await callAgent(context);

    context.push({ role: 'assistant', content: response });

    console.log({ response });

    sendMessage();
}

sendMessage();