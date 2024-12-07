<script lang="ts" setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';

const error = ref({
  status: false,
  message: "",
});

const sent = ref(false);

const message = ref({
  from: "",
  subject: "",
  text: "",
});

const validateInput = () => {
  if (!message.value.from.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
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
  sendEmail();
};

const displayToast = (type: string) => {
  if (type === "success") {
    sent.value = true;
    setTimeout(() => (sent.value = false), 5000);
  } else {
    error.value.status = true;
    setTimeout(() => {
      error.value.status = false;
      error.value.message = "";
    }, 5000);
  }
};

const sendEmail = async () => {

  const templateParams = {
    from_name: message.value.from,
    subject: message.value.subject,
    message: message.value.text,
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    displayToast("success");
  } catch (e) {
    console.error("FAILED...", e.text);
    displayToast("error");
  }
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
