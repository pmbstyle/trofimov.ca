<script lang="ts" setup>
import pdf from '@/assets/Slava_Trofimov_Full_Stack_Engineer.pdf'
const experience = [
  {
    title: 'AI Engineer',
    company: 'Loblaw Digital, Toronto, ON',
    date: 'January 2026 to current',
    description: `Building AI-powered tools and workflows with the Loblaw Digital team`,
  },
  {
    title: 'Senior Full Stack Engineer',
    company: 'Jobscan - Seattle, WA',
    date: 'February 2024 to Jul 2025',
    description: `
    <ul>
    <li>Shipped core product features end-to-end with Vue.js, Laravel, and AI agentic flows; owned a
    flagship feature as the sole engineer from design through launch
    </li>
    <li>Integrated AI into critical workflows using the OpenAI API and in-house models; built
    agentic/tool-calling pipelines that automated key processes and enriched user experience
    </li>
    <li>Tracked down and fixed hard-to-reproduce frontend/backend/agentic bugs, improving
    stability and reducing latency (TTFT)
    </li>
    <li>Raised quality by introducing Vitest unit tests and Playwright E2E suites, increasing coverage,
    and adding CI gates
    </li>
    <li>Partnered with PM/Design/ML/Support and consistently exceeded individual and team KPIs
    for delivery, quality, and reliability
    </li>
    </ul>`,
  },
  {
    title: 'Senior Front End Developer',
    company: 'Codepxl - Toronto, ON',
    date: 'January 2019 to February 2024',
    description: `
    <ul>
    <li>Led the frontend team and owned projects end-to-end, from architecture and estimation to
    implementation, QA, and deployment</li>
    <li>Built responsive, high-performance apps with Vue.js, Nuxt.js (SSR), and Laravel; turned Figma
    designs into reusable component libraries and design systems</li>
    <li>Served as the primary technical contact for clients; ran discovery, wrote
    requirements/acceptance criteria, and aligned delivery with business goals</li>
    <li>Drove Agile delivery: Scrum, managed backlog/sprints, and coordinated with design and
    backend to unblock execution</li>
    <li>Improved delivery speed by ~30% via component reuse, tighter release planning, and CI
    discipline</li>
    <li>Shipped a range of builds—from small WordPress sites to large-scale social/community
    platforms—meeting accessibility, SEO, and cross-browser standards</li>
    <li>Raised code quality through reviews, mentoring, and standards for performance,
    accessibility, and testing (component/unit and E2E)</li>
    </ul>`,
  },
  {
    title: 'Front End Developer',
    company: 'EvolutionInDesignZ - Toronto, ON',
    date: 'May 2018 to December 2018',
    description: `
    <ul>
    <li>Delivered custom sites/apps across Laravel, WordPress, and OpenCart for clients in diverse
    industries</li>
    <li>Translated Figma/Sketch designs into responsive, SEO-friendly, WCAG-aware UIs using
    semantic HTML5, SASS, and JavaScript</li>
    <li>Built a scalable SPA with Vue.js, Nuxt.js, and Electron</li>
    <li>Collaborated with design/backend on requirements, cross-browser QA, and pixel-accurate
    implementation</li>
    <li>Strengthened core FE fundamentals and built discipline, contributing to smoother releases
    and fewer regressions</li>
    </ul>`,
  },
  {
    title: 'Web Developer',
    company: 'Electrolight Ent. - Toronto, ON',
    date: 'August 2017 to May 2018',
    description: `
    <ul>
    <li>Led the development and maintenance of custom corporate websites using WordPress and
    Opencart</li>
    <li>Integrated third-party APIs to streamline operations and enhance user experience</li>
    <li>Developed content management systems and security tutorials, empowering teams with web
    resource utilization</li>
    <li>Improved SEO and web accessibility, resulting in increased site traffic and user engagement
    </li>
    </ul>`,
  },
  {
    title: 'Front End Developer',
    company: 'iMoan - Moscow',
    date: 'August 2015 to July 2017',
    description: `
    <ul>
    <li>Collaborated with cross-functional teams to ensure project success in a fast-paced
    environment</li>
    <li>Developed and launched e-commerce websites using WordPress/Opencart and Django,
    leveraging HTML5, LESS, jQuery, PHP, and Python</li>
    <li>Enhanced online presence through impactful landing pages and corporate resources</li>
    <li>Achieved significant SEO improvements, elevating user experience and engagement</li>
    </ul>`,
  },
  {
    title: 'Front End Developer / Web Designer',
    company: 'Web Solution Ltd. - Moscow',
    date: 'March 2013 to August 2015',
    description: `
    <ul>
    <li>Spearheaded the design and development of various websites, enhancing user experience
    across platforms</li>
    <li>Implemented front-end interfaces using HTML/CSS, jQuery, Bootstrap, and PHP for seamless
    functionality</li>
    <li>Conducted market research and integrated SEO best practices, boosting online visibility and
    search rankings</li>
    <li>Fostered strong client relationships, resulting in the successful delivery of modern web
    applications</li>
    </ul>`,
  },
]
const profile = [
  '<strong>Front-end:</strong> JavaScript (ES6+), TypeScript, Vue 3, Nuxt 3 (SSR/SSG), Pinia, Vite, Vue Router, TailwindCSS, shadcn/ui, SASS/SCSS, React, Electron, SPA/PWA, accessibility (WCAG 2.1)',
  '<strong>Backend:</strong> PHP (Laravel), Node.js, Python',
  '<strong>Testing & QA:</strong> Vitest, Playwright, Cypress, CI gates',
  '<strong>APIs & Data:</strong> REST, GraphQL, MySQL/PostgreSQL, SQLite',
  '<strong>DevOps:</strong> Docker & Docker Compose, Git/GitHub, GitHub Actions (CI/CD), Nginx',
  '<strong>AI & Agentic:</strong> OpenAI/Anthropic API, OpenRouter, agent/tool-calling flows, RAG, vector DBs (Pinecone/Chroma/HNSWlib), MCP, LangGraph, CrewAI',
]
const education = [
  {
    title: 'Master in Computer Science',
    place: 'Moscow State Open University',
    date: '2003 to 2008',
  },
]
const skills = [
  'Vue.js / Nuxt.js (6 years)',
  'Laravel / PHP (4 years)',
  'Javascript (8 years)',
  'TypeScript (4 years)',
  'Bootstrap / Tailwindcss (5 years)',
  'React.js / Next.js (1 year)',
  'HTML5 / SCSS (8 years)',
  'REST (6 years)',
  'jQuery (7 years)',
  'MySQL/ MangoDB (6 years)',
  'Node.js (3 years)',
  'Responsive styling (8 years)',
  'Webpack / Vite / Gulp (5 years)',
  'WordPress / OpenCart (8 years)',
  'GitHub (8 years)',
  'Docker (5 years)',
]
</script>
<template>
  <article class="resume">
    <h1>
      Slava Trofimov
      <span>(<a :href="pdf" target="_blank">download PDF</a>)</span>
    </h1>
    <p>
      <strong>Full Stack Engineer</strong><br />
      Welland, ON<br />
      <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a><br />
      <a href="tel:2899808683">+1(289)980-8683</a>
    </p>
    <section>
      <p>
        Full-Stack Engineer focused on front-end (Vue/Nuxt) and AI, with strong
        back-end in Laravel/PHP, Node.js, and Python. Leads features end-to-end,
        from architecture to launch, integrating AI (OpenAI API, custom models,
        and agentic flows), resolving hard production bugs, and enhancing
        quality with Vitest/Playwright and CI/CD. Proven track record improving
        performance and exceeding team KPIs for delivery, quality, and
        reliability
      </p>
      <p v-for="(p, index) in profile" :key="index" v-html="p"></p>
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
