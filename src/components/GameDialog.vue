<script lang="ts" setup>
defineProps({
	show: Boolean,
	type: String
})
const content = {
	skills: `<p><strong>Hello traveler!</strong></p>
	<p>I'll tell you a little about Slava's skills.</p>
	<p>His primary stack is <strong>Laravel + Vue / Nuxt</strong>.<br/>
	He is using <strong>SCSS, LESS, TailwindCSS, Bootstrap</strong>, etc.,
	compiling with <strong>Vite, Webpack</strong> and <strong>Gulp</strong>.</p>
	<p>Have a wide experience with many frameworks and platforms, such as:<br/>
	<strong>NodeJs, WordPress, Electron, Opencart, React, jQuery</strong>, etc.</p>
	<p>He is working with <strong>PHP, JavaScript, TypeScript</strong>, connecting all of it to <strong>MySQL, MongoDB, SQLite</strong>, etc.</p>
	<p>Version control with <strong>Github</strong> and <strong>BitBucket</strong>.<br/>
	He is using <strong>Docker</strong> for local development.<br/>
	Task management in <strong>Jira, ClickUp</strong>.<br/>
	Using <strong>Linux/Mac/Windows</strong> on a daily basis.</p>`
}
</script>
<template>
	<div class="game-dialog" v-if="show">
		<div class="close-dialog" @click="$emit('close')">x</div>
		<perfect-scrollbar ref="termScroll">
			<div class="game-dialog__content " v-html="content[type]"></div>
		</perfect-scrollbar>
	</div>
</template>