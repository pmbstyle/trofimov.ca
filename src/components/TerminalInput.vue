<template>
  <TerminalCommand :pwd="store.pwd">
    <input
      class="input rounded-none"
      id="termInput"
      v-model="store.currentCommand"
      @keyup.enter="onEnter"
      @keydown.up="onUp"
      @keydown.down="onDown"
      @keydown.tab="onTab"
      autofocus
    />
  </TerminalCommand>
</template>

<script setup lang="ts">
import { useTerminalStore } from "@/stores/terminal";
import TerminalCommand from "./TerminalCommand.vue";
import runCommand from "@/commands/execCommand";
import filesystem from "@/config/filesystem";
import { ref } from "vue";

const store = useTerminalStore();
const currentCommandHistory = ref(-1);
const currentTypedCommand = ref("");

const emit = defineEmits(["termInput"]);

const onEnter = () => {
  runCommand();
  currentCommandHistory.value = -1;
  currentTypedCommand.value = "";
  setTimeout(() => {
    emit("termInput");
  }, 50);
};

const onUp = (event: KeyboardEvent) => {
  event.preventDefault();
  if (currentCommandHistory.value === -1) {
    currentCommandHistory.value = store.validHistory.length - 1;
    currentTypedCommand.value = store.currentCommand;
  } else if (currentCommandHistory.value > 0) {
    currentCommandHistory.value--;
  }
  store.currentCommand =
    store.validHistory[currentCommandHistory.value].command;
};

const onDown = (event: KeyboardEvent) => {
  event.preventDefault();
  if (currentCommandHistory.value === -1) {
    return;
  }
  if (currentCommandHistory.value < store.validHistory.length - 1) {
    currentCommandHistory.value++;
    store.currentCommand =
      store.validHistory[currentCommandHistory.value].command;
  } else {
    currentCommandHistory.value = -1;
    store.currentCommand = currentTypedCommand.value;
  }
};

const onTab = (event: KeyboardEvent) => {
  event.preventDefault();

  let options = [];
  filesystem.forEach((item) => {
    if (item.name.startsWith(store.currentCommand.split(" ")[1])) {
      options.push(item.name);
    }
  });
  if (options.length === 1) {
    store.currentCommand =
      store.currentCommand.split(" ")[0] + " " + options[0];
  } else if (options.length > 1) {
    store.currentCommand =
      store.currentCommand.split(" ")[0] + " " + options[0];
    store.currentCommand += "\n" + options.join("\t");
  }
};
</script>
