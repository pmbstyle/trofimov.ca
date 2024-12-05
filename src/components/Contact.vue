<script lang="ts" setup>
import { ref } from "vue";

const telegramToken = import.meta.env.VITE_TELEGRAM_TOKEN;
const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const error = ref({
  status: false,
  message: "",
});

const sent = ref(false);

const message = ref({
  from: "",
  to: "slava@trofimov.ca",
  subject: "",
  text: "",
  attachments: [],
});

const editorOptions = {
  debug: "info",
  modules: {
    toolbar: [
      { font: [] },
      { align: [] },
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      { color: [] },
      { background: [] },
    ],
  },
  placeholder: "Your message",
  theme: "snow",
};

const handleToChange = () => {
  let input = document.getElementById("to") as HTMLInputElement;
  input.value = message.value.to;
};

const validateInput = () => {
  if (message.value.from === "") {
    error.value.message = "Please enter your email address.";
    displayToast("error");
    return;
  }
  if (message.value.from.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    error.value.message = "";
  } else {
    error.value.message = "Please enter a valid email address.";
    displayToast("error");
    return;
  }
  if (message.value.subject === "") {
    error.value.message = "Please enter a subject.";
    displayToast("error");
    return;
  }
  if (message.value.text === "") {
    error.value.message = "Please enter a message.";
    displayToast("error");
    return;
  }
  error.value.status = false;
  error.value.message = "";
  sendMail();
};

const displayToast = (type: string) => {
  if (type === "success") {
    sent.value = true;
    setTimeout(() => {
      sent.value = false;
      let closeWindow = document.querySelector(".close-window") as HTMLElement;
      closeWindow.click();
    }, 5000);
    return;
  } else {
    error.value.status = true;
    setTimeout(() => {
      error.value.status = false;
      error.value.message = "";
    }, 5000);
  }
};

const sendMail = async () => {
  await fetch("https://api.telegram.org/bot" + telegramToken + "/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text:
        "From: " +
        message.value.from +
        "\n" +
        "Subject: " +
        message.value.subject +
        "\n" +
        "Message: " +
        message.value.text,
    }),
  });
  displayToast("success");
};
</script>
<template>
  <div id="mailform" class="flex-1 flex flex-col">
    <div class="toast toast-middle toast-center">
      <div
        class="alert alert-warning w-[300px] animate-bounce text-center"
        v-if="error.status"
      >
        <span>{{ error.message }}</span>
      </div>
      <div
        class="alert alert-success w-[300px] animate-bounce text-center"
        v-if="sent"
      >
        <span>Message sent. Thank you.</span>
      </div>
    </div>
    <div class="flex items-center pt-4">
      <span class="w-[100px] text-right">From:</span>
      <input
        type="text"
        class="input input-bordered w-full ml-4"
        id="from"
        name="from"
        v-model="message.from"
        placeholder="Your email"
      />
    </div>
    <div class="flex items-center pt-2">
      <span class="w-[100px] text-right">To:</span>
      <input
        type="text"
        class="input input-bordered w-full ml-4"
        id="to"
        name="to"
        value="slava@trofimov.ca"
        @keyup="handleToChange"
      />
    </div>
    <div class="flex items-center pt-2">
      <span class="w-[100px] text-right">Subject:</span>
      <input
        type="text"
        class="input input-bordered w-full ml-4"
        id="subject"
        name="subject"
        v-model="message.subject"
      />
    </div>
    <div class="pt-2 pb-4 flex-1 flex flex-col">
      <QuillEditor
        :options="editorOptions"
        v-model:content="message.text"
        contentType="text"
      />
    </div>
    <div class="btn-row flex items-center">
      <button
        class="btn btn-primary"
        @click="validateInput"
        :disabled="error.status || sent"
      >
        Send
      </button>
    </div>
  </div>
</template>
