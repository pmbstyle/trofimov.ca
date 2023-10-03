<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import Terminal from '@/components/Terminal.vue'
    import Game from '@/components/Game.vue'
    import GameDialog from '@/components/GameDialog.vue'
    import Clock from '@/components/Clock.vue'
    import Resume from '@/components/Resume.vue'
    import Contact from '@/components/Contact.vue'
    import Tux from '@/assets/img/tux.svg'
    import Slava from '@/assets/img/slava.png'
    import Cactus from '@/assets/img/cactus.png'
    import Controller from '@/assets/img/controller.png'
    import Keyboard from '@/assets/img/keyboard.png'
    import VueLogo from '@/assets/img/vue.png'
    import ReactLogo from '@/assets/img/react.png'

    const hideWelcome = ref(false)
    const showDesktop = ref(false)
    const showTerminal = ref(false)
    const showGame = ref(false)
    const showResume = ref(false)
    const showContact = ref(false)
    const showHelloDialog = ref(false)

    const dialogues = ref([
        {
            name: 'blacksmith',
            show: false,
            type: 'skills'
        },
        {
            name: 'scarecrow',
            show: false,
            type: 'experience'
        },
        {
            name: 'mailbox',
            show: false,
            type: 'contacts'
        },
        {
            name: 'stand',
            show: false,
            type: 'education'
        },
        {
            name: 'statue',
            show: false,
            type: 'about'
        }
    ])

    const openDialog = (index:integer,name:string) => {
        let checkbox = document.getElementById(name+'Dialog') as HTMLInputElement
        if(checkbox?.checked) {
            dialogues.value[index].show = true
        } else {
            dialogues.value[index].show = false
        }
    }

    const switchWindow = (name:string) => {
        switch(name) {
            case 'terminal':
                showGame.value = false
                showDesktop.value = false
                showResume.value = false
                showContact.value = false
                showTerminal.value = true
                break
            case 'game':
                showDesktop.value = false
                showTerminal.value = false
                showResume.value = false
                showContact.value = false
                showGame.value = true
                break
            case 'resume':
                showDesktop.value = false
                showTerminal.value = false
                showGame.value = false
                showContact.value = false
                showResume.value = true
                break
            case 'contact':
                showDesktop.value = false
                showTerminal.value = false
                showGame.value = false
                showResume.value = false
                showContact.value = true
                break
            case 'desktop':
                showTerminal.value = false
                showGame.value = false
                showResume.value = false
                showContact.value = false
                showDesktop.value = true
                break
        }
    }

    const currentWindow = computed(() => {
        if(showTerminal.value) {
            return 'Terminal'
        } else if(showGame.value) {
            return 'Game of resume'
        } else if(showResume.value) {
            return 'Resume.pdf'
        } else if(showDesktop.value) {
            return 'Slava Trofimov'
        }
        else if(showContact.value) {
            return 'Send me email'
        }
    })

    const reload = () => {
        window.location = window.location + '?g=true'
    }

    onMounted(()=> {
        const urlParams = new URLSearchParams(window.location.search)
        const g = urlParams.get('g')
        console.log(urlParams.get('g'))
        if(g) {
            showDesktop.value = true
            hideWelcome.value = true
            window.history.replaceState({}, document.title, "/")
        } else {
            setTimeout(() => {
                hideWelcome.value = true
                showDesktop.value = true
                showHelloDialog.value = true
            }, 2000)
        }
    })
</script>

<template>
    <main class="h-full w-full h-full relative">
        <div class="container mx-auto flex flex-col h-full justify-center relative z-20">
            <div id="monitor" class="relative">

                <img :src="Cactus" class="cactus" />
                <img :src="Controller" class="controller" v-if="showGame"/>
                <img :src="Keyboard" class="keyboard" v-if="showTerminal"/>

                <div class="monitor-screen flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                    <div class="top-menu glass absolute h-8 w-full bg-slate-100/50 pl-5 pr-5 flex z-30">
                        <img :src="Slava" class="tux" />
                        <span class="text-black ml-3 text-sm window-title">{{currentWindow}}</span>
                        <div class="flex ml-auto top-menu-right">
                            <a href="https://www.linkedin.com/in/slava-trofimov-a1b919128/" class="linkedin tooltip tooltip-bottom" data-tip="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3333 3333"
                                    shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
                                    image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" width="20"
                                    height="20">
                                    <path
                                        d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm-215 1336h342v175h5c48-86 164-175 338-175 361 0 428 225 428 517v596h-357v-528c0-126-3-288-186-288-186 0-214 137-214 279v537h-357V1336zm-247-309c0 102-83 186-186 186-102 0-186-83-186-186 0-102 83-186 186-186 102 0 186 83 186 186zm-371 309h371v1113H834V1336z" />
                                </svg>
                            </a>
                            <a href="https://github.com/pmbstyle" class="github tooltip tooltip-bottom" data-tip="Github">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
                                    image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
                                    viewBox="0 0 640 640">
                                    <path
                                        d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z" />
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/vyacheslav.pmb" class="facebook tooltip tooltip-bottom" data-tip="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3333 3333"
                                    shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
                                    image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" width="20"
                                    height="20">
                                    <path
                                        d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm186 1117h311V744h-311c-240 0-435 195-435 435v186h-249v373h249v994h373v-994h311l62-373h-373v-186c0-34 28-62 62-62z" />
                                </svg>
                            </a>
                            <a href="mailto:slava@trofimov.ca" class="email tooltip tooltip-bottom" data-tip="Email">
                                <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 122.88 122.88" width="20" height="20">
                                    <path class="cls-1"
                                        d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0ZM30.73,38,62,63.47,91.91,38Zm-2,42.89L51,58.55,28.71,40.39V80.87ZM53.43,60.55l-22.95,23H92.21l-21.94-23L63,66.71h0a1.57,1.57,0,0,1-2,0l-7.59-6.19Zm19.24-2,21.5,22.54V40.19L72.67,58.51Z" />
                                </svg>
                            </a>
                            <Clock />
                        </div>
                    </div>

                    <div class="welcome absolute z-10 text-8xl text-white text-bold w-full h-full flex justify-center items-center opacity-80"
                        :class="{ hide: hideWelcome }" v-if="!hideWelcome">
                        Welcome
                    </div>

                    <div class="desktop absolute z-10 w-full h-full"
                        :class="{ show: showDesktop }" v-if="showDesktop">
                        <div class="desktop-item item-terminal hide-mobile" @click="switchWindow('terminal')">
                            <div class="icon"></div>
                            <div class="name">Terminal</div>
                        </div>
                        <div class="desktop-item item-game hide-mobile" @click="switchWindow('game')">
                            <div class="icon"></div>
                            <div class="name">Game</div>
                        </div>
                        <div class="desktop-item item-resume" @click="switchWindow('resume')">
                            <div class="icon"></div>
                            <div class="name">Resume.pdf</div>
                        </div>
                        <div class="desktop-item item-contact" @click="switchWindow('contact')">
                            <div class="icon"></div>
                            <div class="name">Contact</div>
                        </div>
                        <div class="desktop-dialog hide-mobile" v-if="showHelloDialog">
                            <div class="close-dialog" @click="showHelloDialog = false">x</div>
                            <div class="desktop-dialog__content">
                                <perfect-scrollbar ref="helloScroll">
                                    
                                        <h3>Hello!</h3>
                                        <p>My name is Slava Trofimov and I am a Web developer.</p>
                                        <p>This website represents information about me in several different ways:</p>
                                        <ul>
                                            <li><strong>Terminal Interface:</strong> Navigate by entering commands to access content and learn more about various aspects of my journey.</li>
                                            <li><strong>Interactive Experience:</strong> Immerse yourself in an interactive journey, where you can explore this digital landscape, interact with NPCs, and uncover hidden details.</li>
                                            <li><strong>Classic Resume:</strong> If you prefer a more traditional approach, you can download a conventional resume that offers a snapshot of my experiences in the field of web development.</li>
                                        </ul>
                                        <p>If you'd like to experience this site from a different angle, you can switch to the <a href="https://react.trofimov.ca">React.js</a> version by clicking on the React logo at the bottom.</p>
                                        <p>For those curious about the inner workings, you can find the source code for this website on my <a href="https://github.com/pmbstyle">Git Profile</a> page.</p>
                                        <p>If you have any questions or opportunities you'd like to discuss, please feel free to contact me. Your visit is greatly appreciated, and I wish you a pleasant day ahead! 🌐🌟</p>
                                   
                                </perfect-scrollbar>
                            </div>
                        </div>
                    </div>

                    <div class="mockup-window border bg-base-300 flex-1 flex flex-col mt-10 mb-5 ml-5 mr-5 drop-shadow-md absolute z-20"
                        :class="{ show: showContact }" v-if="showContact">
                        <div class="window-header">
                            <div class="close-window" @click="switchWindow('desktop')">x</div>
                            <div class="minimize-window" @click="switchWindow('desktop')">–</div>
                            <div class="maximize-window">□</div>
                        </div>
                        <div class="flex justify-left px-4 pb-6 bg-base-200 flex-1 relative">
                            <Contact/>
                        </div>
                    </div>

                    <div class="mockup-window border bg-base-300 flex-1 mt-10 mb-5 ml-5 mr-5 drop-shadow-md absolute z-20"
                        :class="{ show: showResume }" v-if="showResume">
                        <div class="window-header">
                            <div class="close-window" @click="switchWindow('desktop')">x</div>
                            <div class="minimize-window" @click="switchWindow('desktop')">–</div>
                            <div class="maximize-window">□</div>
                        </div>
                        <div class="flex justify-left px-4 py-6 bg-base-200 terminal-wrapper relative">
                            <perfect-scrollbar ref="resumeScroll">
                                <Resume />
                            </perfect-scrollbar>
                        </div>
                    </div>

                    <div class="mockup-window border bg-base-300 flex-1 mt-10 mb-5 ml-5 mr-5 drop-shadow-md absolute z-20"
                        :class="{ show: showTerminal }" v-if="showTerminal">
                        <div class="window-header">
                            <div class="close-window" @click="switchWindow('desktop')">x</div>
                            <div class="minimize-window" @click="switchWindow('desktop')">–</div>
                            <div class="maximize-window">□</div>
                        </div>
                        <div class="flex justify-left px-4 py-6 bg-base-200 terminal-wrapper relative">
                            <Terminal />
                        </div>
                    </div>

                    <div class="game mockup-window border bg-base-300 flex-1 mt-10 mb-5 ml-5 mr-5 drop-shadow-md absolute z-20"
                        :class="{ show: showGame}" v-if="showGame">
                        <div class="window-header">
                            <div class="close-window" @click="reload()">x</div>
                            <div class="minimize-window" @click="reload()">–</div>
                            <div class="maximize-window">□</div>
                        </div>
                        <div class="flex justify-left bg-base-200 game-wrapper relative">
                            <div class="game-controls absolute mt-5 ml-5 text-left">
                                <p>Movement: <kbd class="kbd">W</kbd> <kbd class="kbd">A</kbd> <kbd class="kbd">S</kbd> <kbd class="kbd">D</kbd></p>
                                <p>Action: <kbd class="kbd">SPACE</kbd></p>
                            </div>
                            <Game />
                            <GameDialog v-for="(dialog,index) in dialogues" :key="index"
                                @close="dialog.show = false" :show="dialog.show" :type="dialog.type"/>
                        </div>
                        <input type="checkbox" :id="dialog.name+'Dialog'" class="hidden"
                            v-for="(dialog,index) in dialogues" :key="index"
                            @change="openDialog(index,dialog.name)" :checked="dialog.show">
                    </div>

                </div>
                <div class="monitor-screen-bottom bg-gradient-to-t from-slate-300 to-slate-200">
                    <img :src="Tux" class="tux">
                </div>
                <div class="monitor-stand">
                    <div class="framework-switch">
                        <a href="https://react.trofimov.ca"><img :src="ReactLogo"/></a>
                        <svg fill="#666" version="1.1" xmlns="http://www.w3.org/2000/svg" xmln:link="http://www.w3.org/1999/xlink" 
                            width="30px" height="30px" viewBox="0 0 400.004 400.004"
                            xml:space="preserve">
                        <g>
                            <path d="M382.688,182.686H59.116l77.209-77.214c6.764-6.76,6.764-17.726,0-24.485c-6.764-6.764-17.73-6.764-24.484,0L5.073,187.757
                                c-6.764,6.76-6.764,17.727,0,24.485l106.768,106.775c3.381,3.383,7.812,5.072,12.242,5.072c4.43,0,8.861-1.689,12.242-5.072
                                c6.764-6.76,6.764-17.726,0-24.484l-77.209-77.218h323.572c9.562,0,17.316-7.753,17.316-17.315
                                C400.004,190.438,392.251,182.686,382.688,182.686z"/>
                        </g>
                        </svg>
                        <a href="#" class="active"><img :src="VueLogo"/></a>
                    </div>
                </div>
                <div class="monitor-base drop-shadow-xl"></div>
            </div>
        </div>
        <div class="table absolute z-10 w-full bg-gradient-to-tr from-gray-900 to-gray-800"></div>
    </main>
</template>
