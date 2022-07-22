<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import moment from 'moment'

    const dateTime = ref('')

    const setDateTime = () => {
        dateTime.value = moment().format('H:mm:ss')
    }

    onMounted(() => {
        setInterval(setDateTime, 1000)
    })
</script>

<template>
    <div class="clock text-sm text-black">{{ dateTime }}</div>
</template>