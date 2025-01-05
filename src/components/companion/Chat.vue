<template>
  <div class="chat-container">
    <div class="chat-body">
      <div class="chat chat-end">
        <div class="chat-bubble">{{ chatOutput }}</div>
      </div>
    </div>
    <div class="chat-footer">
      <input
        type="text"
        name="companion-input"
        placeholder="Type your message..."
        autocomplete="off"
        class="input input-bordered input-sm flex-1"
        v-model="message"
        @keyup.enter="addMessage()"
        :disabled="chatStore.isLoading"
      />
      <button
        class="btn btn-sm btn-primary"
        @click="addMessage()"
        :disabled="chatStore.isLoading"
      >
        {{ chatStore.isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>
    <div v-if="chatStore.error" class="text-error text-sm mt-2">
      {{ chatStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

interface Message {
  type: 'user' | 'companion'
  value: string
}

const chatStore = useChatStore()
const messages = ref([] as Message[])
const message = ref('' as string)

const chatOutput = ref(
  `Hello there! 🐾 Welcome to Slava Trofimov's professional website! I'm Whiskers, your purr-suasive guide. How can I assist you today?`
)

const addMessage = async () => {
  if (message.value.trim() === '') return

  messages.value.push({
    type: 'user',
    value: message.value,
  })

  chatOutput.value = '...'

  await chatStore.sendMessage(message.value)

  const lastResponse = chatStore.chatHistory[chatStore.chatHistory.length - 1]
  if (lastResponse && lastResponse.role === 'assistant') {
    chatOutput.value = lastResponse.content
  }

  message.value = ''
}
</script>

<style type="postcss" scoped>
.ps {
  @apply w-full;
}
.chat-body {
  @apply w-full flex-1 p-4 relative;
  .chat-end .chat-bubble {
    @apply text-right;
  }
  .chat-start .chat-bubble {
    @apply text-left;
  }
}
</style>
