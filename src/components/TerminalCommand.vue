<script lang="ts" setup>
	import config from "@/config"

	defineProps<{
		pwd: string
	}>()
</script>

<template>
	<div class="command-container">
		<div class="command-prefix">
			<span class="user-info"> {{ config.terminal.visitorUsername }}@{{ config.info.domain }} </span>
			<span class="user-sep">{{ ":" }}</span>
			<span class="user-path"> {{ $props.pwd }} </span>
		</div>
		<div class="command-slot">
			<slot />
		</div>
	</div>
</template>
