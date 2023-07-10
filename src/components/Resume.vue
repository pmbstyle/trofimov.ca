<script lang="ts" setup>
import pdf from '@/assets/Slava-Trofimov_Full-Stack-Developer.pdf'
const experience = [
    {
        title: 'Senior Front End Developer',
        company: 'Codepxl - Toronto, ON',
        date: 'January 2019 to Present',
        description: `Toronto-based App development, website design,
        complex system development, and graphic design agency.
        HTML5, SAAS, Vue3/Nuxt3, SPA, Laravel, WordPress, OpenCart projects development.`
    },
    {
        title: 'Front End Developer',
        company: 'EvolutionInDesignZ - Toronto, ON',
        date: 'May 2018 to December 2018',
        description: `Web app development, website development, graphic design and online marketing agency.
        HTML5,SCSS, SPA, VueJS, Laravel, OpenCart, Wordpress projects development.`
    },
    {
        title: 'Web Master',
        company: 'Electrolight Enterprises - Toronto, ON',
        date: 'August 2017 to May 2018',
        description: `Lighting & Design Services for the GTA. Web mastering , content management.`
    },
    {
        title: 'Front End Developer',
        company: 'iMoan.ru - Moscow',
        date: 'August 2015 to July 2017',
        description: `One of the fast-growing e-commerce projects in the adult industry.
        HTML5 (pug) / CSS3 (Less) / JS(jQuery, Angular) / PHP (Opencart) coding, Web/UI design, VPS administrative, SEO, Projectmenagment, work with remote employees.`
    },
    {
        title: 'Lead Front End Developer',
        company: 'Web Solution Ltd. - Moscow',
        date: 'March 2013 to August 2015',
        description: `Web design studio with hundreds of clients. Front-end development and UI design.
        HTML5 (pug) /CSS3 (Less) / JS (jQuery) / PHP (Joomla, WordPress, Opencart) coding.`
    },
    {
        title: 'Front End Developer',
        company: 'Giftery corp. - Moscow',
        date: 'February 2012 to March 2013',
        description: `Startup Giftery.ru is buyers bonus card system with many of commerce partners.
        Front-end development. HTML5 / CSS3 (Less) / JS (jQuery) / PHP (1C bitrix) coding.`
    },
    {
        title: 'Front End Developer',
        company: 'Predestination.ru - Moscow',
        date: 'January 2011 to February 2012',
        description: `Popular business training project with multiple courses and programs.
        Front-end development,Web design, UI Design. HTML / CSS / JS (jQuery) / PHP (WordPress) coding.`
    },
    {
        title: 'Junior Front End Developer',
        company: 'KM ONLINE, R-STYLE COMPANY GROUP - Moscow',
        date: '2008 to 2010',
        description: `News, entertainment and media company. Work on social media project - vkrugudruzei.ru.
        Front-end development. HTML / CSS / JS (jQuery) coding.`
    }
]
const education = [
    {
        title: 'Master in Computer Science',
        place: 'Moscow State Open University - Moscow',
        date: '2007 to 2008'
    },
    {
        title: 'Diploma in Computer Science',
        place: 'Moscow Technological University - Moscow',
        date: '2003 to 2007'
    }
]
const skills = [
    'Javascript (7 years)', 'HTML5 (10+ years)', 'CSS (10+ years)', 'Vue.js (4 years)', 'Angular (1 year)', 'Php (3 years)', 'Python (1 year)', 'Bootstrap (4 years)', 'SPA (2 years)', 'Laravel (3 years)', 'Adobe Photoshop (5 years)', 'Wordpress (5 years)', 'Opencart (5 years)', 'Django (2 years)', 'Node.js', 'CSS (10 years)', 'SCSS (6 years)', 'GitHub (5 years)', 'AJAX (7 years)', 'UI/UX (7 years)', 'REST API', 'Responsive styling (10+ years)', 'Electron (2 years)', 'MySQL (5 years)', 'MongoDB (1 year)', 'NuxtJS (1 year)', 'Tailwind CSS (2 years)', 'Docker (3 years)'
]
</script>
<template>
	<article class="resume">
        <h1>Slava Trofimov <span>(<a :href="pdf" target="_blank">download PDF</a>)</span></h1>
        <p><strong>Full Stack Developer</strong><br/>
        Richmond Hill, ON<br/>
        <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a><br/>
        +1(289)980-8683</p>
        <section>
            <p>I'm a Full Stack Developer from Toronto.</p>
            <p>
                I have more than 12 years of experience as a Front End Developer and 3+ years as a Full Stack
                Developer.
            </p>
            <p>
                Experienced in several high-traffic projects from educational to real-time data management and social
                networks.
            </p>
            <p>
                I specialize in all aspects of web development from basic HTML/CSS/JS coding to creating full-scale web
                applications with rich REST API(PHP/NodeJs).
            </p>
            <p>
                My primary stack is Laravel+Vue but I have experience with WordPress, Opencart, Electron, React,
                NodeJs, Python, etc. Have good DevOps skills, and experience with all common databases such as
                MySQL, MongoDB, SQLite, etc. Using Git / GitLab / BitBucket, Jira, Slack, Linux/Mac/Windows daily.
            </p>
            <p>
                A fast learner, problem solver, and team player, always seeking skill improvement and better
                practices.
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Work Experience</strong></p>
            <p v-for="(e,index) in experience" :key="index">
                <b>{{e.title}}</b><br/>
                <small>{{e.company}}</small><br/>
                <small>{{e.date}}</small><br/>
                {{e.description}}<br/>
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Education</strong></p>
            <p v-for="(e,index) in education" :key="index">
                <b>{{e.title}}</b><br/>
                <small>{{e.place}}</small><br/>
                <small>{{e.date}}</small><br/>
            </p>
        </section>

        <section>
            <p class="dashed"><strong>Skills</strong></p>
            <ul>
                <li v-for="(s,index) in skills" :key="index">
                    {{s}}
                </li>
            </ul>
        </section>

        <section>
            <p class="dashed"><strong>Languages</strong></p>
            <ul>
                <li>
                    English - Fluent
                </li>
                <li>
                    Russian - Expert
                </li>
            </ul>
        </section>
    </article>
</template>