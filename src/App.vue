<script setup lang="ts">
  import Terminal from '@/components/Terminal.vue'
  import Clock from '@/components/Clock.vue'
  import Tux from '@/assets/img/tux.svg'
  import Cactus from '@/assets/img/cactus.png'
</script>

<template>
    <main class="h-full w-full h-full relative">
        <div class="container mx-auto flex flex-col h-full justify-center relative z-20">
            <div id="monitor" class="relative">
                <img :src="Cactus" class="cactus" />
                <div class="monitor-screen flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                    <div class="top-menu absolute h-8 w-full bg-slate-100/50 pl-5 pr-5 flex">
                        <img :src="Tux" class="tux" />
                        <span class="text-black ml-3 text-sm">Slava Trofimov</span>
                        <Clock/>
                    </div>
                    <div class="mockup-window border bg-base-300 flex-1 mt-10 mb-5 ml-5 mr-5 drop-shadow-md">
                        <div class="flex justify-left px-4 py-6 bg-base-200 terminal-wrapper relative">
                            <Terminal />
                        </div>
                    </div>
                </div>
                <div class="monitor-screen-bottom bg-gradient-to-t from-slate-300 to-slate-200">
                    <img :src="Tux" class="tux">
                </div>
                <div class="monitor-stand"></div>
                <div class="monitor-base drop-shadow-xl"></div>
            </div>
        </div>
        <div class="table absolute z-10 w-full bg-gradient-to-tr from-gray-900 to-gray-800"></div>
    </main>
</template>
