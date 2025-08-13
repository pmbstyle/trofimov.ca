---
title: A Journey with Alice (Part 2) - Making Alice faster and smarter
date: 2025-08-10
author: Slava Trofimov
excerpt: By late 2024, I had an AI assistant that could listen, speak, and even recognize screenshots. But Alice was still slow, and not that smart...
---

# A Journey with Alice (Part 2)
**Making Alice Smart**

By late 2024, I had an AI assistant that could listen, speak, and even recognize screenshots.  
But Alice was still slow, and not that *smart*.

Every interaction took too long due to slow voice activity detection (VAD), no response streaming, no memory of previous interactions, and a complete lack of tools.  
It was time to fix all of that, and maybe even give Alice a visual upgrade, re-render her videos, and add more states.


## Making a Robust Voice Activity Detection

My custom VAD solution worked, but it was still sluggish and often misdetected silence.  

After some research, I found a great library, [VAD (Web)](https://github.com/ricky0123/vad), and implemented it into Alice’s logic:

```javascript
// Initializing VAD instance
try {
  const assetPath = vadAssetBasePath.value
  const vadInstance = await vad.MicVAD.new({
    baseAssetPath: assetPath,
    onnxWASMBasePath: assetPath,
    onSpeechStart: () => {
      isSpeechDetected.value = true
    },
    onSpeechEnd: (audio: Float32Array) => {
      if (audioState.value === 'LISTENING' && isSpeechDetected.value) {
        processAudioRecording(audio)
      } else {
        isSpeechDetected.value = false
      }
    },
  })
  myvad.value = vadInstance
  myvad.value.start()
} catch (error) {
  setAudioState('IDLE')
  generalStore.statusMessage = 'Error: Mic/VAD init failed'
  isSpeechDetected.value = false
} finally {
  isVadInitializing.value = false
}
````

With some tweaking, the slow VAD problem was gone.


## Streaming Everything

The next bottleneck was the long delay between sending a request and Alice starting to speak.

The original pipeline was:

1. Receive the *full* response from Alice.
2. Send the *full* text to TTS.
3. Play the *full* audio.

The problem? We had to wait twice, first for the full text, then for the full audio.

**Solution:** Stream everything.

### Streaming LLM output

Here’s the change, enable streaming in the request:

```javascript
export const runAssistant = async (
  threadId: string,
  assistantId: string
) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    stream: true, // just one change here
    temperature: 0.5,
  })
  return run
}
```

Then, listen for stream events and send text chunks to both:

* the chat UI, and
* TTS (once a sentence ends).

```javascript
const chat = async (memories: any) => {
  statusMessage.value = 'Thinking...'
  updateVideo.value('PROCESSING')
  isProcessingRequest.value = true
  const run = await runAssistant(thread.value, assistant.value, memories)

  let currentSentence = ''
  let messageId: string | null = null

  for await (const chunk of run) {
    if (
      chunk.event === 'thread.message.created' &&
      chunk.data.assistant_id === assistant.value
    ) {
      messageId = chunk.data.id
      chatHistory.value.unshift({
        id: messageId,
        role: 'assistant',
        content: [{ type: 'text', text: { value: '', annotations: [] } }],
      })
    }

    if (
      chunk.event === 'thread.message.delta' &&
      chunk.data.delta?.content[0].type === 'text'
    ) {
      const textChunk = chunk.data.delta.content[0].text.value
      currentSentence += textChunk

      if (messageId) {
        const msg = chatHistory.value.find(m => m.id === messageId)
        if (msg) msg.content[0].text.value += textChunk
      }

      if (textChunk.match(/[.!?]\s*$/)) {
        const audioResponse = await ttsStream(currentSentence)
        generalStore.playAudio(audioResponse)
        currentSentence = ''
      }
    }
  }

  if (currentSentence.trim()) {
    const audioResponse = await ttsStream(currentSentence)
    generalStore.playAudio(audioResponse)
  }

  isProcessingRequest.value = false
}
```

Now Alice starts speaking after the first sentence, and smaller audio fragments generate faster.


## Adding a Vector Database

Why a vector DB and not just SQLite?
Because searching for *related* content in a plain DB quickly becomes a nightmare. With a vector DB, we can fetch semantically related data instead of exact matches.

Example:
If I ask, *"Do you remember my cat’s name?"*, Alice should recall past messages mentioning cats, not just exact keyword matches.

**Vector DBs** store embedded content as vectors and find the closest matches mathematically.

I picked [Pinecone](https://www.pinecone.io/) for its simplicity, price, and solid docs. For embeddings, I used OpenAI’s `text-embedding-ada-002`.

```javascript
const embedText = async (text: any) => {
  text = JSON.stringify(text)
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: 'float',
  })
  return response.data[0].embedding
}

export const retrieveRelevantMemories = async (content: string, topK = 5) => {
  let embedding = await embedText(content)
  return await getRelatedMessages(topK, embedding)
}

// Pinecone provider
import { Pinecone } from '@pinecone-database/pinecone'
const pinecone = new Pinecone({ apiKey: import.meta.env.VITE_PINECONE_API_KEY })
const index = pinecone.Index(import.meta.env.VITE_PINECONE_INDEX)

export const getRelatedMessages = async (topK = 5, embedding: any) => {
  const results = await index.query({
    vector: embedding,
    topK,
    includeValues: true,
    includeMetadata: true,
  })
  return results.matches.map(match => match?.metadata?.content)
}

export const setIndex = async (
  conversationId: string,
  role: string,
  content: any,
  embedding: any
) => {
  await index.upsert([
    {
      id: `${conversationId}-${role}-${Date.now()}`,
      values: embedding,
      metadata: {
        role: role,
        content: JSON.stringify(content.content[0].text.value),
      },
    },
  ])
}
```

When running the assistant, we attach retrieved memories to the request:

```javascript
export const runAssistant = async (
  threadId: string,
  assistantId: string,
  history: any = []
) => {
  const h = JSON.stringify(history)
  return await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    stream: true,
    temperature: 0.5,
    additional_instructions: 'Memories related to user question: ' + h,
  })
}
```

Boom, Alice now has a basic memory system.


## Function Calling (Web Search)

Today, many LLM APIs have built-in web search, but back then, you had to implement it yourself.

Function calling is one of the most powerful ways to extend an LLM.
With the Assistant API, you could only control tools through the assistant configuration:

```javascript
const assistant = await client.beta.assistants.create({
  model: "gpt-4o",
  instructions: "You are a weather bot. Use the provided functions to answer questions.",
  tools: [
    {
      type: "function",
      function: {
        name: "getCurrentTemperature",
        description: "Get the current temperature for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "The city and state" },
            unit: {
              type: "string",
              enum: ["Celsius", "Fahrenheit"],
              description: "Infer this from the user's location",
            },
          },
          required: ["location", "unit"],
        },
      },
    },
  ]
})
```

### Web Search Tool Definition (JSON Schema)

```json
{
  "name": "perform_web_search",
  "description": "Searches the web for information on a given query. Use this for current events, general knowledge questions, or topics not covered by other tools.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The specific search query or question to look up on the web."
      }
    },
    "required": ["query"]
  }
}
```

### Function Implementation

Using the [Tavily API](https://www.tavily.com/) for LLM-friendly search:

```javascript
async function perform_web_search(args) {
  if (!TAVILY_API_KEY) return { success: false, error: 'Tavily API key missing' }
  if (!args.query) return { success: false, error: 'Search query is missing' }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: TAVILY_API_KEY,
      query: args.query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 5,
    })

    const answer = response.data.answer
    const results = response.data.results?.map(res => ({
      title: res.title,
      url: res.url,
      snippet: res.content,
    }))

    return { success: true, data: answer ? { answer, sources: results } : { results } }
  } catch (error) {
    return { success: false, error: `Failed to perform web search: ${error.message}` }
  }
}
```

### Handling Tool Calls in the Stream

```javascript
async function processRunStream(runStream) {
  let runId = null

  for await (const chunk of runStream) {
    await processChunk(chunk)

    if (
      chunk.event === 'thread.run.requires_action' &&
      chunk.data.required_action?.type === 'submit_tool_outputs'
    ) {
      runId = chunk.data.id
      const toolCalls = chunk.data.required_action.submit_tool_outputs.tool_calls

      const toolOutputs = []
      for (const toolCall of toolCalls) {
        if (toolCall.type === 'function') {
          const functionName = toolCall.function.name
          const functionArgs = toolCall.function.arguments
          try {
            statusMessage.value = `${functionName}`
            const result = await executeFunction(functionName, functionArgs)
            toolOutputs.push({ tool_call_id: toolCall.id, output: result })
          } catch (error) {
            toolOutputs.push({ tool_call_id: toolCall.id, output: `Error: ${error.message}` })
          }
        }
      }

      if (toolOutputs.length > 0) {
        const continuedRun = await submitToolOutputs(thread.value, runId, toolOutputs, assistant.value)
        await processRunStream(continuedRun)
        return
      }
    }
  }
}
```

Now Alice could browse the web, and this set the foundation for much more functionality.

As a bonus I've updated Alice's look. That took a very long time, but now Alice had a "Thinking" state as well, which was triggered when we are calling LLM inference.

<img src="https://github.com/pmbstyle/Alice/blob/e2f56ed9210a9551349fe4fb7566a057ce01c5dc/screenshot.png?raw=true">

Next up: migrating from the Assistants API to the Responses API, unlocking even cooler possibilities.
That’s for **Part 3** 😉
