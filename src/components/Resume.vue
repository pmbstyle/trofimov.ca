<script lang="ts" setup>
import pdf from '@/assets/Slava_Trofimov_Front_End(Full_Stack)_Developer.pdf'
const experience = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'Jobscan - Seattle, WA',
    date: 'February 2024 to Present',
    description: `
        <p>Building industry-leading tools for job seekers.</p>`,
  },
  {
    title: 'Senior Front End Developer',
    company: 'Codepxl - Toronto, ON',
    date: 'January 2019 to February 2024',
    description: `
        <p>Front End and Full Stack development using Vue, Nuxt, Laravel,
        WordPress, jQuery, and Vanilla Javascript. Styling based on Figma
        designs with HTML5, CSS3 (SASS), and TailwindCSS/Bootstrap.</p>
        <p>Single page and Progressive Web Applications development,
        project planning, structuring, maintaining legacy code, and
        mentoring.</p>`,
  },
  {
    title: 'Front End Developer',
    company: 'eQuoto, - Toronto, ON',
    date: 'November 2018 to November 2019',
    description: `
        <p>Worked on a wide variety of marketing websites based on Laravel
        and WordPress. Used Vue, React, Bootstrap and Tailwindcss.</p>`,
  },
  {
    title: 'Front End Developer',
    company: 'EvolutionInDesignZ - Toronto, ON',
    date: 'May 2018 to December 2018',
    description: `
        <p>Worked on many different custom Laravel, WordPress and
        Opencart-based real-estate, educational, non-profit, large-data,
        and thin-client projects. Implemented Figma/Sketch designs into
        cross- platform accessible and SEO-friendly front-end code using
        HTML5/SASS, JavaScript, Vue, Laravel blade, jQuery, and Bootstrap.</p>`,
  },
  {
    title: 'Web Developer',
    company: 'Electrolight Ent. - Toronto, ON',
    date: 'August 2017 to May 2018',
    description: `
        <p>Developed and maintained custom corporate websites based on
        WordPress and Opencart using HTML5/CSS3, JavaScript, and
        jQuery. Integrated third-party APIs, converted mockups into UI, and
        improved SEO and web accessibility. Implemented content
        management and security resource tutorials to assist end-user
        training.</p>`,
  },
  {
    title: 'Front End Developer',
    company: 'iMoan - Moscow',
    date: 'August 2015 to July 2017',
    description: `
        <p>
            Worked cooperatively with client services, sales, and design teams
            in a deadline-driven environment. Developed e-commerce
            websites based on Opencart and Django framework using
            HTML5/LESS, jQuery, PHP, and Python.<br/>
            Designed and built landing pages and corporate resources.<br/>
            Improved SEO and UI/UX in general.
        </p>`,
  },
  {
    title: 'Front End Developer / Web Designer',
    company: 'Web Solution Ltd. - Moscow',
    date: 'March 2013 to August 2015',
    description: `
        <p>Designed and built a wide variety of websites from small
        WordPress/Joomla-based corporate sites to big e-commerce
        solutions as Front End and Full Stack developer.<br/>
        Implemented front-end interfaces using HTML/CSS, jQuery,
        Bootstrap, and PHP.<br/>
        Made market research and implemented SEO best practices.
        Worked closely with end clients to develop modern and productive
        web applications.</p>`,
  },
]
const profile = [
  'JavaScript/TypeScript',
  'JavaScript Frameworks (Vue.js, Nuxt.js), Libraries (React.js, jQuery)',
  'HTML5 & CSS3, POSTCSS, SCSS',
  'Mobile-first, pixel-perfect styling',
  'SPA, PWA, SSR development',
  'CSS Preprocessors (SASS, LESS) and Template Engines (Laravel Blade, PUG)',
  'RESTful Service and Third-Party API interaction',
  'Unit Testing (Jest), Debugging, Application Maintenance',
  'Desktop App Development (Electron.js)',
  'Web Accessibility (WCAG) and SEO Best Practices',
  'Full Stack Development (PHP, Python, Node.js)',
  'Git/Version Control, Pull Requests, Code Reviews',
]
const education = [
  {
    title: 'Master in Computer Science',
    place: 'Moscow State Open University',
    date: '2003 to 2008',
  },
]
const skills = [
  'Vue.js / Nuxt.js (5 years)',
  'React.js / Next.js (1 year)',
  'HTML5 / SCSS (8 years)',
  'Bootstrap / Tailwindcss (5 years)',
  'Javascript (8 years)',
  'REST (6 years)',
  'jQuery (7 years)',
  'Laravel / PHP (3 years)',
  'MySQL/ MangoDB (6 years)',
  'Node.js (3 years)',
  'TypeScript (2 years)',
  'Responsive styling (8 years)',
  'Webpack / Vite / Gulp (5 years)',
  'WordPress / OpenCart (8 years)',
  'GitHub (6 years)',
  'Docker (4 years)',
]
</script>
<template>
  <article class="resume">
    <h1>
      Slava Trofimov
      <span>(<a :href="pdf" target="_blank">download PDF</a>)</span>
    </h1>
    <p>
      <strong>Senior Front End Developer</strong><br />
      Richmond Hill, ON<br />
      <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a><br />
      <a href="tel:2899808683">+1(289)980-8683</a>
    </p>
    <section>
      <p>
        Front End Developer with strong expertise in JavaScript, Vue.js, REST,
        and HTML5/SCSS. Bring a Full Stack skill set, having worked extensively
        with Laravel and PHP, contributing to numerous Laravel+Vue.js/Nuxt.js
        projects. I'm also proficient in React.js, WordPress, Opencart, and
        Electron.js. Well-versed in essential development tools like Git and
        Docker and have experience with collaboration platforms such as Figma,
        Jira/ClickUp, and Slack. Dedication to ongoing enhancement and a knack
        for resolving challenges add value to any development environment.
      </p>
    </section>

    <section>
      <p class="dashed"><strong>Work Profile</strong></p>
      <ul class="my-4 py-2">
        <li v-for="(p, index) in profile" :key="index">
          {{ p }}
        </li>
      </ul>
    </section>

    <section>
      <p class="dashed"><strong>Work Experience</strong></p>
      <div class="my-4 py-2" v-for="(e, index) in experience" :key="index">
        <b>{{ e.title }}</b
        ><br />
        <small>{{ e.company }}</small
        ><br />
        <small>{{ e.date }}</small
        ><br />
        <div v-html="e.description"></div>
      </div>
    </section>

    <section>
      <p class="dashed"><strong>Education</strong></p>
      <p v-for="(e, index) in education" :key="index">
        <b>{{ e.title }}</b
        ><br />
        <small>{{ e.place }}</small
        ><br />
        <small>{{ e.date }}</small
        ><br />
      </p>
    </section>

    <section>
      <p class="dashed"><strong>Technical Profile</strong></p>
      <ul>
        <li v-for="(s, index) in skills" :key="index">
          {{ s }}
        </li>
      </ul>
    </section>

    <section>
      <p class="dashed"><strong>Competencies</strong></p>
      <ul>
        <li>Effective communication</li>
        <li>Team player</li>
        <li>Strong problem solver</li>
        <li>Good time management</li>
      </ul>
    </section>

    <section>
      <p class="dashed"><strong>Interests</strong></p>
      <ul>
        <li>Astrophotography</li>
        <li>Artificial intelligence</li>
        <li>Video games</li>
        <li>Travelling</li>
        <li>Music</li>
      </ul>
    </section>

    <section>
      <p class="dashed"><strong>Languages</strong></p>
      <ul>
        <li>English - Fluent</li>
      </ul>
    </section>
  </article>
</template>
