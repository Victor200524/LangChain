import 'dotenv/config';
import { ChatOpenRouter } from '@langchain/openrouter';

const llm = new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'nvidia/nemotron-3.5-super-vl:free'
});

const response = await llm.invoke("Diga 'hello world na infoeste 2026'");

console.log(response.content);