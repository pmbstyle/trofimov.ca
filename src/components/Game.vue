<script lang="ts" setup>

import { ref, onMounted, nextTick } from "vue"
import * as Phaser from 'phaser'
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin"
import MainScene  from "@/game/MainScene"

const config = ref<Phaser.Types.Core.GameConfig>({
    type: Phaser.AUTO,
    width:768,
    height:500,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        MainScene
    ],
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false
        }
    },
    transparent: true,
    autoFocus: true,
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
    await nextTick()
    new Phaser.Game(config.value)
})


</script>

<template>
	<div id="game" class="game w-full overflow-hidden"></div>
</template>