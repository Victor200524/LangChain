import { graph } from './grafo.js'

const pergunta = process.argv[2] ?? 'Quem ganhou a Copa do Mundo de futebol de 2002?'

const stream = await graph.stream(
    { messages: [{ role: 'user', content: pergunta }] },
    { streamMode: 'updates' }
)

for await (const update of stream) {
    for (const [no, dados] of Object.entries(update)) {
        console.log(`--- nó executado: ${no} ---`)
        dados.messages.forEach((message: any) => {
            console.log(message.content)
        })
    }
}
