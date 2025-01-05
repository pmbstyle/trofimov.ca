<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Terminal from '@/components/Terminal.vue'
import Game from '@/components/Game.vue'
import GameDialog from '@/components/GameDialog.vue'
import Resume from '@/components/Resume.vue'
import Contact from '@/components/Contact.vue'
import Tux from '@/assets/img/tux.svg'
import Cactus from '@/assets/img/cactus.png'
import Controller from '@/assets/img/controller.png'
import Keyboard from '@/assets/img/keyboard.png'
import Window from '@/components/Window.vue'
import DesktopIcons from '@/components/desktop/DesktopIcons.vue'
import TopMenu from '@/components/desktop/TopMenu.vue'
import WelcomeScreen from '@/components/desktop/WelcomeScreen.vue'
import Companion from '@/components/companion/CharWrapper.vue'

const hideWelcome = ref(false)
const showHelloDialog = ref(false)

const dialogues = ref([
  {
    name: 'blacksmith',
    show: false,
    type: 'skills',
  },
  {
    name: 'scarecrow',
    show: false,
    type: 'experience',
  },
  {
    name: 'mailbox',
    show: false,
    type: 'contacts',
  },
  {
    name: 'stand',
    show: false,
    type: 'education',
  },
  {
    name: 'statue',
    show: false,
    type: 'about',
  },
])

const folders = ref({
  projects: false,
})

const windows = {
  terminal: 'terminal',
  game: 'game',
  resume: 'resume',
  contact: 'contact',
  desktop: 'desktop',
}

const windowStates = ref({
  terminal: false,
  game: false,
  resume: false,
  contact: false,
  desktop: false,
})

const openDialog = (index: integer, name: string) => {
  const checkbox = document.getElementById(name + 'Dialog') as HTMLInputElement
  if (checkbox?.checked) {
    dialogues.value[index].show = true
  } else {
    dialogues.value[index].show = false
  }
}

const switchWindow = (name: keyof typeof windows) => {
  Object.keys(windowStates.value).forEach(key => {
    windowStates.value[key as keyof typeof windows] = false
  })

  windowStates.value[name] = true
}

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const currentWindow = computed(() => {
  const windowTitles = {
    terminal: 'Terminal',
    game: 'Game of resume',
    resume: 'Resume.pdf',
    desktop: 'Slava Trofimov',
    contact: 'Send me email',
  }

  const activeWindow = Object.keys(windowStates.value).find(
    key => windowStates.value[key as keyof typeof windowStates.value]
  )
  return activeWindow
    ? windowTitles[activeWindow as keyof typeof windowTitles]
    : windowTitles.desktop
})

const reload = () => {
  window.location.assign(window.location + '?g=true')
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const g = urlParams.get('g')
  if (g) {
    windowStates.value.desktop = true
    hideWelcome.value = true
    window.history.replaceState({}, document.title, '/')
  } else {
    setTimeout(() => {
      hideWelcome.value = true
      windowStates.value.desktop = true
      showHelloDialog.value = true
    }, 2000)
  }
})
</script>

<template>
  <main class="h-full w-full h-full relative">
    <div
      class="container mx-auto flex flex-col h-full justify-center relative z-20"
    >
      <div id="monitor" class="relative">
        <img :src="Cactus" class="cactus" />
        <img :src="Controller" class="controller" v-if="windowStates.game" />
        <img :src="Keyboard" class="keyboard" v-if="windowStates.terminal" />

        <div
          class="monitor-screen flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
        >
          <TopMenu :currentWindow="currentWindow" />
          <WelcomeScreen v-if="!hideWelcome" :hideWelcome="hideWelcome" />

          <div
            class="desktop absolute z-10 w-full h-full"
            :class="{ show: windowStates.desktop }"
            v-if="windowStates.desktop"
          >
            <DesktopIcons @switchWindow="switchWindow" @openUrl="openUrl" />

            <div class="desktop-dialog hide-mobile" v-if="showHelloDialog">
              <div class="close-dialog" @click="showHelloDialog = false">x</div>
              <div class="desktop-dialog__content h-[100%]">
                <h3 class="font-semibold">Hello!</h3>
                <p>
                  My name is Slava Trofimov and I am a Full Stack Web engineer.
                </p>
                <p>
                  This website represents information about me in several
                  different ways:
                </p>
                <ul>
                  <li>
                    <strong>Terminal Interface:</strong> Navigate by entering
                    commands to access content and learn more about various
                    aspects of my journey.
                  </li>
                  <li>
                    <strong>Interactive Experience:</strong> Immerse yourself in
                    an interactive journey, where you can explore this digital
                    landscape, interact with NPCs, and uncover hidden details.
                  </li>
                  <li>
                    <strong>Classic Resume:</strong> If you prefer a more
                    traditional approach, you can download a conventional resume
                    that offers a snapshot of my experiences in the field of web
                    development.
                  </li>
                </ul>
                <p>
                  For those curious about the inner workings, you can find the
                  source code for this website on my
                  <a href="https://github.com/pmbstyle">Git Profile</a> page.
                </p>
                <p>
                  Your visit is greatly appreciated, and I wish you a pleasant
                  day ahead! 🌐🌟
                </p>
              </div>
            </div>

            <Companion />
          </div>

          <Window
            v-if="windowStates.contact"
            :class="{ show: windowStates.contact }"
            :component="Contact"
            @close="switchWindow('desktop')"
          >
            <div
              class="flex justify-left px-4 pb-6 bg-base-200 flex-1 relative"
            >
              <Contact />
            </div>
          </Window>

          <Window
            v-if="windowStates.resume"
            :class="{ show: windowStates.resume }"
            :component="Resume"
            @close="switchWindow('desktop')"
          >
            <div
              class="flex justify-left px-4 py-6 bg-base-200 terminal-wrapper relative"
            >
              <perfect-scrollbar ref="resumeScroll">
                <Resume />
              </perfect-scrollbar>
            </div>
          </Window>

          <Window
            v-if="windowStates.terminal"
            :class="{ show: windowStates.terminal }"
            :component="Terminal"
            @close="switchWindow('desktop')"
          >
            <div
              class="flex justify-left px-4 py-6 bg-base-200 terminal-wrapper relative"
            >
              <Terminal />
            </div>
          </Window>

          <Window
            v-if="windowStates.game"
            :class="{ show: windowStates.game }"
            :component="Terminal"
            @close="reload()"
          >
            <div class="flex justify-left bg-base-200 game-wrapper relative">
              <div class="game-controls absolute mt-5 ml-5 text-left">
                <p>
                  Movement: <kbd class="kbd">W</kbd> <kbd class="kbd">A</kbd>
                  <kbd class="kbd">S</kbd> <kbd class="kbd">D</kbd>
                </p>
                <p>Action: <kbd class="kbd">SPACE</kbd></p>
              </div>
              <Game />
              <GameDialog
                v-for="(dialog, index) in dialogues"
                :key="index"
                @close="dialog.show = false"
                :show="dialog.show"
                :type="dialog.type"
              />
            </div>
            <input
              type="checkbox"
              :id="dialog.name + 'Dialog'"
              class="hidden"
              v-for="(dialog, index) in dialogues"
              :key="index"
              @change="openDialog(index, dialog.name)"
              :checked="dialog.show"
            />
          </Window>
        </div>
        <div
          class="monitor-screen-bottom bg-gradient-to-t from-slate-300 to-slate-200"
        >
          <img :src="Tux" class="tux" />
        </div>
        <div class="monitor-stand"></div>
        <div class="monitor-base drop-shadow-xl"></div>
      </div>
    </div>
    <div
      class="table absolute z-10 w-full bg-gradient-to-tr from-gray-900 to-gray-800"
    ></div>
  </main>
</template>
