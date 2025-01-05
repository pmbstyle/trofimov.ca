<script setup lang="ts">
import Clock from '@/components/Clock.vue'
import Slava from '@/assets/img/slava.png'

defineProps<{
  currentWindow: string
}>()
</script>

<template>
  <div
    class="top-menu glass absolute h-8 w-full bg-slate-100/50 pl-5 pr-5 flex z-30"
  >
    <img :src="Slava" class="tux" />
    <span class="text-black ml-3 text-sm window-title">{{
      currentWindow
    }}</span>
    <div class="flex ml-auto top-menu-right">
      <a
        href="https://www.linkedin.com/in/slava-trofimov-a1b919128/"
        class="linkedin tooltip tooltip-bottom"
        data-tip="LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 3333 3333"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          width="20"
          height="20"
        >
          <path
            d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm-215 1336h342v175h5c48-86 164-175 338-175 361 0 428 225 428 517v596h-357v-528c0-126-3-288-186-288-186 0-214 137-214 279v537h-357V1336zm-247-309c0 102-83 186-186 186-102 0-186-83-186-186 0-102 83-186 186-186 102 0 186 83 186 186zm-371 309h371v1113H834V1336z"
          />
        </svg>
      </a>
      <a
        href="https://github.com/pmbstyle"
        class="github tooltip tooltip-bottom"
        data-tip="Github"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          viewBox="0 0 640 640"
        >
          <path
            d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"
          />
        </svg>
      </a>
      <a
        href="https://www.facebook.com/vyacheslav.pmb"
        class="facebook tooltip tooltip-bottom"
        data-tip="Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 3333 3333"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          width="20"
          height="20"
        >
          <path
            d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm186 1117h311V744h-311c-240 0-435 195-435 435v186h-249v373h249v994h373v-994h311l62-373h-373v-186c0-34 28-62 62-62z"
          />
        </svg>
      </a>
      <a
        href="mailto:slava@trofimov.ca"
        class="email tooltip tooltip-bottom"
        data-tip="Email"
      >
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 122.88 122.88"
          width="20"
          height="20"
        >
          <path
            class="cls-1"
            d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0ZM30.73,38,62,63.47,91.91,38Zm-2,42.89L51,58.55,28.71,40.39V80.87ZM53.43,60.55l-22.95,23H92.21l-21.94-23L63,66.71h0a1.57,1.57,0,0,1-2,0l-7.59-6.19Zm19.24-2,21.5,22.54V40.19L72.67,58.51Z"
          />
        </svg>
      </a>
      <Clock />
    </div>
  </div>
</template>
