<script lang="ts" setup>
import pdf from '@/assets/Slava_Trofimov-Full_Stack_AI_Engineer_resume.pdf'
const experience = [
  {
    title: 'AI Engineer',
    company: 'Loblaw Digital, Toronto, ON',
    date: 'January 2026 to current',
    description: `
    <ul>
      <li>Architected and implemented scalable multi-source ingestion pipelines for unstructured
      healthcare and enterprise data (PDF, HTML, Markdown) with parallel processing and validation layers
      </li>
      <li>Designed AI-powered document intelligence workflows for internal and customer-facing
      applications, enabling structured extraction and semantic enrichment for downstream AI applications
      </li>
      <li>Designed and deployed a vector-based retrieval infrastructure processing thousands of
      documents daily and enabling low-latency semantic search
      </li>
      <li>Developed agentic tooling integrating third-party APIs, enterprise systems, and secure data
      sources
      </li>
      <li>Implemented evaluation, monitoring, and reprocessing pipelines to ensure data quality and
    model reliability
      </li>
      <li>Collaborated with cross-functional teams (Product, Data, Security, Architecture) to align AI
  solutions with enterprise standards and compliance requirements
      </li>
    </ul>`,
  },
  {
    title: 'AI Engineer',
    company: 'AliceAI, Toronto, ON',
    date: 'July 2025 to January 2026',
    description: `
    <ul>
    <li>Designed and implemented Python-based data ingestion pipelines for unstructured
    documents (PDF, HTML, Markdown)</li>
    </li>
    <li>Built RAG systems using vector databases (Qdrant) for semantic search and retrieval
    </li>
    <li>Implemented LLM-powered tooling using LangChain and LangGraph-style agent
    orchestration
    </li>
    <li>Integrated OpenAI APIs for embeddings, tool calling, and structured outputs
    </li>
    <li>Developed internal CLI and API tooling to support indexing, reprocessing, and evaluation
    workflows
    </li>
    </ul>`,
  },
  {
    title: 'Senior Full Stack Engineer / AI Engineer',
    company: 'Jobscan - Seattle, WA',
    date: 'February 2024 to Jul 2025',
    description: `
    <ul>
    <li>Integrated AI into critical product workflows using the OpenAI API and internal models; built
    agentic and tool-calling pipelines to automate core processes</li>
    <li>Designed and shipped backend services supporting AI features, including data processing,
    orchestration, and integration with existing systems</li>
    <li>Shipped core product features end-to-end using Vue.js and Laravel; owned a flagship feature
    as the sole engineer from design through launch</li>
    <li>Investigated and resolved complex frontend and backend issues, improving system stability
    and reducing support load</li>
    <li>Improved code quality and reliability by introducing Vitest unit tests and Playwright E2E
    suites with CI enforcement</li>
    <li>Optimized performance across key flows via query tuning, caching strategies, and UI
    optimizations</li>
    <li>Partnered closely with PM, Design, and Support, consistently exceeding delivery and quality
    KPIs</li>
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
  '<strong>Agentic architectures & tool-calling systems:</strong> RAG pipelines & vector search (Qdrant/Weaviate etc.)',
  '<strong>Structured outputs & schema validation:</strong> Prompt engineering & evaluation workflows',
  '<strong>Memory layers (semantic + canonical):</strong> MCP integrations & external tool orchestration',
  '<strong>Conversational AI systems:</strong> TTS / STT / embeddings pipelines',
  '<strong>Data & Backend Infrastructure:</strong> Python (FastAPI), Node.js, Laravel, Distributed ingestion pipelines (PDF/HTML/Markdown), Chunking, enrichment, indexing workflows, Airflow, REST / GraphQL APIs, MySQL, PostgreSQL, MongoDB, SQLite, Docker & containerized services, CI/CD & automated validation',
  '<strong>Agent Frameworks & Orchestration:</strong> LangChain, LangGraph, CrewAI, Custom orchestration layers, Async task delegation patterns, Multi-agent workflows',
  '<strong>Front-end:</strong> JavaScript (ES6+), TypeScript, Vue 3, Nuxt 3 (SSR/SSG), Pinia, Vite, Vue Router, Tailwind CSS, shadcn/ui, SASS/SCSS, React, Electron, SPA/PWA, browser extensions, accessibility (WCAG 2.1)',
  '<strong>DevOps:</strong> Docker & Docker Compose, Git/GitHub, GitHub Actions (CI/CD), Nginx, Linux',
  '<strong>AI Tools:</strong> Cursor, Claude Code, Codex, OpenCode, Gemini CLI, self-made agentic tools (multi-agent orchestration)',

]
const education = [
  {
    title: 'Master in Computer Science',
    place: 'Moscow State Open University',
    date: '2003 to 2008',
  },
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
        AI engineer specializing in production-grade LLM systems, agentic architectures, and intelligent data
        pipelines.Designs scalable ingestion, retrieval, and orchestration layers for enterprise AI
        applications. Experienced in building RAG systems, vector search, tool-calling agents, and
        structured-output workflows.
        Background in full-stack engineering enables end-to-end ownership, from distributed backend
        systems to user-facing AI experiences, with a strong focus on reliability, evaluation, and performance
        in production environments.
        Actively exploring multi-agent architectures and autonomous orchestration systems in independent
        research projects.
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
