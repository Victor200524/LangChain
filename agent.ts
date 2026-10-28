import 'dotenv/config';
import { ChatOpenRouter } from '@langchain/openrouter';
import { createAgent } from 'langchain';
import { trim } from 'zod/v4/mini';

const llm = new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'nvidia/nemotron-3.5-super-vl:free'
});

const agent = createAgent({
    model: llm,
    systemPrompt:` 
    INSTRUÇÃO: Você é um assitente virtual, amigavel
    `.trim()
})

const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: "Diga olá para mim'"
        }
    ]
});

console.log(result.messages[1]?.content)