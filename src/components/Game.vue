<script lang="ts" setup>

import { ref, onMounted, nextTick } from "vue"
import Phaser from "phaser"
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin"
import MainScene  from "@/game/MainScene"

const config = ref<Phaser.Types.Core.GameConfig>({
    type: Phaser.AUTO,
    width:300,
    height:300,
    scene: [
        MainScene
    ],
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: true
        }
    },
    backgroundColor: '#999',
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
})

onMounted(async () => {
    config.value.width = document.getElementById('game')?.offsetWidth
    config.value.height = document.getElementById('game')?.offsetHeight
    
    await nextTick()
   
    new Phaser.Game(config.value)
})

</script>

<template>
	<div id="game" class="game w-full"></div>
</template>