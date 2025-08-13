---
title: A Journey with Alice (Part 1) - I want my own personal AI assistant
date: 2025-08-09
author: Slava Trofimov
excerpt: AI entered our daily lives very abruptly. What seemed impossible just a few years ago is now ordinary. OpenAI popularized the idea of interacting with AI via chat, and it instantly became incredibly cool. Say what you will, but ChatGPT changed the world and changed us. Like many others, I’ve been closely following every twist and turn in AI’s development, and I always wanted to experiment with it myself...
---

# A Journey with Alice (Part 1)
**Developing a Personal Desktop AI Assistant**

AI entered our daily lives very abruptly. What seemed impossible just a few years ago is now ordinary.  
OpenAI popularized the idea of interacting with AI via chat, and it instantly became incredibly cool.  
Say what you will, but ChatGPT changed the world and changed us.

Like many others, I’ve been closely following every twist and turn in AI’s development, and I always wanted to experiment with it myself.  

By the end of 2023, I started thinking about creating my own chatbot. In my experience, the best way to learn new technology is to make something of your own and learn along the way.  

But building *just another* chatbot sounded boring.  
So I asked myself, *what’s missing in ChatGPT for me personally?*  
The answer: **personalization**, **voice input/output**, and a **“live” assistant avatar**.
Realtime API will be introduced in May 2024.

Great, now I had a project idea worth working on.


## Choosing the Stack

At that time, I had some experience developing a video chat system for a telehealth project (doctor–patient communication), so I had a basic understanding of working with media in the browser.  
I’d also always liked Electron for how easily it integrates with frontend frameworks, you code your app like any web project and then wrap it in Electron.

As for the frontend framework, the choice was obvious: **Vue 3 with Composition API**, something I know and love.  
I believe that if your project doesn’t require learning a completely new environment, you should stick to tech you already know well. That way, you can focus on learning new techniques while keeping development fast.


## Picking the API

I started with the [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview) (now almost deprecated and scheduled for shutdown in the first half of 2026).  
It made sense, I was building an assistant, after all.

This API had everything I needed:
- Configurable system prompt
- Model choice, temperature, top-p
- Easy configuration through their GUI
- Built-in **thread** storage on OpenAI’s side, so chat history management was simple.

```javascript
const thread = await openai.beta.threads.create();

const message = await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
  }
);
````

Then I’d run it and process the assistant’s response:

```javascript
let run = await openai.beta.threads.runs.createAndPoll(
  thread.id,
  { 
    assistant_id: assistant.id
  }
);

if (run.status === 'completed') {
  const messages = await openai.beta.threads.messages.list(
    run.thread_id
  );
  for (const message of messages.data.reverse()) {
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
} else {
  console.log(run.status);
}
```

It was all straightforward, OpenAI’s documentation is always a pleasure to work with.


## Adding Voice

Now, a chatbot alone wasn’t enough, I wanted voice input and voice output.

I started with basic microphone recording using `MediaRecorder`, triggered by a button press. I collected the audio chunks, converted them to a WAV blob, sent them to Speech-to-Text (STT), and then used the transcription as the user’s message.

```javascript
let mediaRecorder: MediaRecorder | null = null
let audioChunks: BlobPart[] = []

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext)()
        const source = audioContext.createMediaStreamSource(stream)

        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data)
        }
        mediaRecorder.onstop = async () => {
          if(!isRecordingRequested.value) return
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          const arrayBuffer = await audioBlob.arrayBuffer()
          const transcription = await conversationStore.transcribeAudioMessage(arrayBuffer as Buffer)
          processRequest(transcription)
        }
    })
    .catch(error => console.error('Error accessing media devices:', error))
```

For transcription, I used `whisper-1` from the OpenAI API:

```javascript
export const transcribeAudio = async (audioBuffer: Buffer): Promise<string> => {
  const convertedFile = await toFile(audioBuffer, 'audio.wav');
  const response = await openai.audio.transcriptions.create({
    file: convertedFile,
    model: "whisper-1"
  })
  return response?.text
}
```

For the assistant’s reply, I used Text-to-Speech:

```javascript
export const tts = async (text: string) => {
  const audio = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
    response_format: "wav"
  })
  return audio
}
```

I’d just load the resulting file into an `<audio>` element and play it.

## Voice Activity Detection

Push to record mode was not bad but I still wanted to talk with Alice as in regular conversation and decided to experiment with detecting voice activity.
The idea was simple:
- recording is active
- user speaks, we collecting audio chunks
- user stop speaking
- sending audio to STT

Let's implement it.
We will need a way to determine if user stop speaking, so we need to add a simple silence detection.

```javascript
  const silenceThreshold = 43
  const minRMSValue = 1e-10
  const bufferLength = 10
  let rmsBuffer = Array(bufferLength).fill(0)

  const startListening = () => {
    statusMessage.value = 'Listening'
    updateVideo('STAND_BY')
    recognizedText.value = ''
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new (window.AudioContext)()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        source.connect(analyser)

        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data)
        }
        mediaRecorder.onstop = async () => {
          statusMessage.value = 'Stop listening'
          if(!isRecordingRequested.value) return
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          const arrayBuffer = await audioBlob.arrayBuffer()
          const transcription = await conversationStore.transcribeAudioMessage(arrayBuffer as Buffer)
          recognizedText.value = transcription
          storeMessage.value = true
          processRequest(transcription)
        }

        let silenceCounter = 0
        let isSilent = false

        const detectSilence = () => {
          analyser.getByteTimeDomainData(dataArray)
          let sumSquares = 0.0
          for (let i = 0; i < bufferLength; i++) {
            const normalized = (dataArray[i] / 128.0) - 1.0
            sumSquares += normalized * normalized
          }
          const rms = Math.sqrt(sumSquares / bufferLength)
          rmsBuffer.shift()
          rmsBuffer.push(rms)
          const avgRMS = rmsBuffer.reduce((sum, val) => sum + val, 0) / rmsBuffer.length
          const db = 20 * Math.log10(Math.max(avgRMS, minRMSValue)) * -1

          isSilent = (db > silenceThreshold)
          isSilent ? silenceCounter++ : silenceCounter = 0

          if (silenceCounter > 499) {
            stopListening()
            silenceCounter = 0
          } else {
            requestAnimationFrame(detectSilence)
          }
        }

        detectSilence()
      })
      .catch(error => console.error('Error accessing media devices:', error))
    isRecording.value = true
  }
```

This way when there is a silence for a couple seconds we can say that user has stopped speaking and continue with the pipeline.

## Adding ability to attach screenshots

Since Alice is a desktop assistant I wanted to have at least some data from users enviroment.
Let's add an ability to capture a screenshot and attach it to our LLM request.

To do that we need to implement some sort of overlay where we could select an area of the the screenshot using mouse.
I've created overlay.html with all needed logic and attached it to Electron main process as a separate window that we will display when user clicking the screenshot button.
Overlay has 100% with and height to cover user's screen.

```css
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: transparent;
  }
  #overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    cursor: crosshair;
  }
  .selection-box {
    border: 2px dashed #fff;
    position: absolute;
    pointer-events: none;
  }
```

After a user selects screenshot area we will cut it from user screen and thru `ipcRenderer` send it to the main process.

```javascript
  document.getElementById('overlay').addEventListener('mouseup', async (e) => {
    if (!selectionBox) return;
    const endX = e.clientX;
    const endY = e.clientY;
    const rect = selectionBox.getBoundingClientRect();
    document.body.removeChild(selectionBox);

    const source = (await ipcRenderer.invoke('capture-screen'))[0];
    const image = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: screen.width,
          maxWidth: screen.width,
          minHeight: screen.height,
          maxHeight: screen.height
        }
      }
    });

    const track = image.getVideoTracks()[0];
    const capture = new ImageCapture(track);
    const bitmap = await capture.grabFrame();
    track.stop();

    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    const dataURL = await canvas.toDataURL();
    ipcRenderer.invoke('save-screenshot', dataURL);
    ipcRenderer.invoke('hide-overlay');
  });
```

I've used a separate API call to describe an image and attach image description to a run.
```javascript
  const describeImage = async (image: string) => {
		const response = await visionMessage(image)
		return response
	}

  export const visionMessage = async (image: any) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe what is in this screenshot" },
            {
              type: "image_url",
              image_url: {
                "url": image,
                "detail": "high"
              },
            },
          ],
        },
      ],
    })
    return response.choices[0].message.content
  }

  const takeScreenShot = async () => {
    if(!takingScreenShot.value) {
      takingScreenShot.value = true
      statusMessage.value = 'Taking a screenshot'
      await (window as any).electron.showOverlay()
    } else {
      const dataURI = await (window as any).ipcRenderer.invoke('get-screenshot')
      screenShot.value = dataURI
      statusMessage.value = 'Screenshot taken'
      const description = await conversationStore.describeImage(screenShot.value)
      let prompt = {role: 'user', content:'Here is a description of the users screenshot: [start screenshot]'+JSON.stringify(description)+'[/end screenshot]'}
      await conversationStore.sendMessageToThread(prompt, false)
      statusMessage.value = 'Screenshot stored'
      takingScreenShot.value = false
    }
  }
```

This way Alice could "see". Yes, it's not very officiant method, but it worked.

## Giving Alice a Face

Next, I wanted an avatar.
I generated Alice’s image and spent a long time experimenting with [Luma Dream Machine](https://lumalabs.ai/) to create a decent **idle loop** video. At that time, Luma was the only service that could make smooth, looped video, so I used it.

After many generations and some tweaking in DaVinci Resolve, I ended up with a reasonable talking animation for Alice.
I immediately abandoned the idea of **lip sync**, even today, that’s still unrealistic to do well in real-time.

I added a `<video>` element and created status states for Alice (idle / speaking), switching the video depending on the status:

```javascript
import videoSpeaking from '../assets/videos/hd/speaking.mp4'
import videoStandBy from '../assets/videos/hd/standby.mp4'

const setVideo = (type: string) => {
  switch (type) {
    case 'SPEAKING':
      return videoSpeaking
    case 'STAND_BY':
      return videoStandBy
    default:
      return videoStandBy
  }
}
```

```vue
<video ref="aiVideo" :src="videoSource" loop muted :autoplay="isPlaying"></video>
```

<img src="https://github.com/pmbstyle/trofimov.ca/blob/42ff3323e50c19423647a20a8f8710c89f53caf0/src/assets/img/alice.png?raw=true">

## Wrapping up

And just like that, I had the first version of Alice:

* Voice input
* Voice output
* Taking a screenshot
* Animated avatar

I fine-tuned the system prompt so Alice’s responses felt as natural as possible.

**I had my own desktop AI assistant!** 🎉


## But It Was Just the Beginning…

Alice was painfully slow, required manually pressing a button to record voice, and could only answer user questions without any web access or additional tools.
In short, she was **dumb**.

What came next was much more interesting… but that’s a story for **Part 2** 😉
