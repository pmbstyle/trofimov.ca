<script lang="ts" setup>
import scarecrow from '@/assets/game/npc/scarecrow.png'
import mailbox from '@/assets/game/npc/mailbox.png'
import stand from '@/assets/game/npc/stand.png'
import statue from '@/assets/game/npc/statue.png'
import blacksmith from '@/assets/game/npc/blacksmith-solo.png'
defineProps({
	show: Boolean,
	type: String,
})
const content = {
	about: `<p><strong>Hello traveler!</strong></p>
	<p>Here is a letter that I found in that box:</p>
	<p>"My name is Slava Trofimov, I'm a Full StackDeveloper from Toronto, Canada.</p>
	<p>I have more than 12 years of experience as a Front End Developer and 2+ years as a Full Stack Developer.<br/>
	Experienced in several high-traffic projects from educational to real-time data management and social networks.</p>
	<p>I specialize in all aspects of web development from basic HTML/CSS/JS coding to creating full-scale web applications with rich REST API(PHP/NodeJs).</br>
	A fast learner, problem solver, and team player, always seeking skill improvement and better practices.</p>
	<p>On free time I prefer:</p>
	<ul>
		<li>Web development =)</li>
		<li>Video games</li>
		<li>Astronomy and astrophotography</li>
		<li>Music</li>
		<li>Outdoors</li>
	</ul>
	<p>Always interested in new technologies and opportunities.</p>
	<p>I hope you enjoy this site, and if you have any questions, please feel free to contact me.</p>
	<p>Have a nice day! :)"</p>`,
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
	Using <strong>Linux/Mac/Windows</strong> on a daily basis.</p>`,
	experience: `<p><strong>Hello traveler!</strong></p>
	<p>Here you can find Slava's experience.</p>
	<p>Last 5 years of experience, for more information please check out Slava's <strong><a href="https://www.linkedin.com/in/slava-trofimov-a1b919128/">LinkedIn</a></strong> profile.</p>
	<p><strong><u>Senior Front End Developer</u></strong><br/>
	Codepxl (Toronto, Canada)<br/><i>Jan 2019 - Present</i></p>
	<p>Many SPA projects, based on Vue.js/Nuxt.js with Laravel backend/REST API. Tailwind CSS, SCSS, Vanilla JavaScript, Electron, WordPress, and more.<br/>
	<strong>Skills:</strong> VueJS · Nuxt.js · JavaScript · Tailwind CSS · SCSS · SPA · Laravel · NodeJS · PHP · HTML · HTML5 · Git · WordPress · Linux</p>
	<p><strong><u>Front End Developer</u></strong><br/>
	EvolutionInDesignZ (Toronto, Canada)<br/><i>May 2018 - Dec 2018</i></p>
	<p>Web app development, website development, graphic design and online marketing agency. HTML5, SCSS, SPA, Vue.js, Laravel, OpenCart, WordPress projects development.<br/>
	<strong>Skills:</strong> HTML · HTML5 · CSS · SCSS · JavaScript · VueJS · SPA · Laravel · OpenCart · WordPress · Git · Linux</p>`,
	education: `<p><strong>Hello traveler!</strong></p>
	<p>Here you can find Slava's education.</p>
	<p><strong><u>Master in Computer Science</u></strong><br/>
	Moscow Technological University<br/><i>2007 - 2008</i></p>
	<p><strong><u>Diploma in Computer Science</u></strong><br/>
	Moscow Technological University<br/><i>2003 - 2007</i></p>`,
	contacts: `<p><strong>Hello traveler!</strong></p>
	<p>Here you can find Slava's contacts.</p>
	<p>His email is <strong> <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a></strong>.</p>
	<p>You can also find him on <strong><a href="https://www.linkedin.com/in/slava-trofimov-a1b919128/">LinkedIn</a></strong>.</p>
	<p>GitHub: <strong><a href="https://github.com/pmbstyle">pmbstyle</a></strong>.</p>
	<p>Facebook: <strong><a href="https://www.facebook.com/vyacheslav.pmb">Slava Trofimov</a></strong>.</p>`,
}
const icons = {
	about: statue,
	skills: blacksmith,
	experience: scarecrow,
	education: stand,
	contacts: mailbox,
}
const names = {
	about: 'Statue',
	skills: 'Blacksmith',
	experience: 'Scarecrow',
	education: 'Bulletin board',
	contacts: 'Mailbox',
}
</script>
<template>
	<div class="game-dialog" v-if="show">
		<div class="close-dialog" @click="$emit('close')">x</div>
		<div class="game-dialog__icon">
			<img :src="icons[type]" alt="icon" />
		</div>
		<div class="game-dialog__title">{{ names[type] }}</div>
		<perfect-scrollbar ref="termScroll">
			<div class="game-dialog__content " v-html="content[type]"></div>
		</perfect-scrollbar>
	</div>
</template>