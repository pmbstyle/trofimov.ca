import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogsStore = defineStore('dialogs', () => {
  const content = {
    about: `<p><strong>📜 A parchment glows faintly...</strong></p>
    <p>You unroll it to reveal tales of <strong>Slava Trofimov</strong>, the <em>Full-Stack AI Engineer of the North</em>, dwelling in Welland, Ontario.</p>
    <p>His craft now centers on <strong>production-grade LLM systems</strong>, <strong>agentic architectures</strong>, and <strong>intelligent data pipelines</strong>. He designs ingestion, retrieval, and orchestration layers for enterprise AI applications, turning unruly documents into useful knowledge.</p>
    <p>Though forged in front-end lands and seasoned across the full stack, his recent mastery lies in <strong>RAG systems</strong>, <strong>vector search</strong>, <strong>tool-calling agents</strong>, and <strong>structured-output workflows</strong> that behave reliably in the wild.</p>
    <p>Beyond the guild hall, he continues independent research into <strong>multi-agent systems</strong> and <strong>autonomous orchestration</strong>, always seeking better ways for humans and machines to collaborate.</p>
    <p>⚔️ Traveler, should you seek inspiration or wish to trade code-secrets, speak with the NPCs — they guard fragments of his saga.</p>`,

    skills: `<p><strong>🎒 Inventory of Skills</strong></p>
    <ul>
      <li><strong>AI Systems & LLM Engineering:</strong> OpenAI, Anthropic, OpenRouter, tool-calling systems, RAG pipelines, vector search, prompt engineering, evaluation flows, memory layers, MCP integrations, and conversational AI interfaces</li>
      <li><strong>Data & Back-end Smithing:</strong> Python (FastAPI), Node.js, Laravel, distributed ingestion pipelines, chunking, enrichment, indexing, REST, GraphQL, MySQL, PostgreSQL, MongoDB, and SQLite</li>
      <li><strong>Agent Frameworks & Orchestration:</strong> LangChain, LangGraph, CrewAI, custom orchestration layers, async task delegation, and multi-agent workflows</li>
      <li><strong>Front-end Arts:</strong> JavaScript, TypeScript, Vue 3, Nuxt 3, Pinia, Vite, TailwindCSS, shadcn/ui, SCSS, React, Electron, browser extensions, and accessibility (WCAG 2.1)</li>
      <li><strong>DevOps Runes:</strong> Docker, Docker Compose, Git/GitHub, GitHub Actions, Nginx, Linux, and automated validation rituals</li>
      <li><strong>Tools of the Modern Guild:</strong> Cursor, Claude Code, Codex, OpenCode, Gemini CLI, plus self-made agentic tooling</li>
    </ul>
    <p><em>All these artifacts are maintained, polished, and occasionally enchanted under moonlight.</em></p>`,

    experience: `<p><strong>📖 Chronicle of Adventures</strong></p>
    <p><strong>AI Engineer</strong><br/>
    Loblaw Digital — Toronto, Canada<br/><i>Jan 2026 – Present</i></p>
    <ul>
      <li>Architected multi-source ingestion pipelines for healthcare and enterprise scrolls: PDF, HTML, and Markdown alike</li>
      <li>Designed document-intelligence workflows for structured extraction, semantic enrichment, and low-latency retrieval</li>
      <li>Forged vector search infrastructure handling thousands of documents per day</li>
      <li>Built agentic tools that bridge third-party APIs, enterprise systems, and secure internal knowledge</li>
      <li>Maintained evaluation, monitoring, and reprocessing rituals to keep models reliable in production</li>
    </ul>

    <p><strong>AI Engineer</strong><br/>
    AliceAI — Toronto, Canada<br/><i>Jul 2025 – Jan 2026</i></p>
    <ul>
      <li>Built Python-based ingestion pipelines for unstructured knowledge sources</li>
      <li>Crafted RAG systems with Qdrant-backed retrieval and semantic search</li>
      <li>Implemented LangChain and LangGraph-style orchestration for LLM-powered tooling</li>
      <li>Integrated embeddings, tool calling, and structured outputs into practical internal workflows</li>
    </ul>

    <p><strong>Senior Full Stack Engineer / AI Engineer</strong><br/>
    Jobscan — Seattle, United States (Remote)<br/><i>Feb 2024 – Jul 2025</i></p>
    <ul>
      <li>Integrated AI into critical product workflows using OpenAI and internal models</li>
      <li>Designed backend services for orchestration, data processing, and existing-system integrations</li>
      <li>Shipped flagship product features end-to-end with Vue.js and Laravel</li>
      <li>Strengthened quality with Vitest, Playwright, and performance-focused fixes across the stack</li>
    </ul>

    <p><strong>Earlier Expeditions:</strong> codepxl and EvolutionInDesignZ, where he led front-end squads, built Vue/Nuxt realms, shaped reusable component systems, and sharpened his craft across performance, accessibility, QA, and delivery.</p>
    <p><strong>Side Quests:</strong> <a href="https://github.com/pmbstyle/BroodMind" target="_blank">BroodMind</a>, <a href="https://github.com/pmbstyle/Alice" target="_blank">Alice</a>, <a href="https://github.com/pmbstyle/fara-agent" target="_blank">Fara Browser Automation Agent</a>, <a href="https://github.com/pmbstyle/gemini-browser-agent" target="_blank">Gemini Browser Agent</a>, and <a href="https://github.com/pmbstyle/Riddi" target="_blank">Riddi</a>.</p>`,

    education: `<p><strong>🏛 Academy of Knowledge</strong></p>
    <p><strong>Master’s Degree in Computer Science</strong><br/>
    Moscow State Open University (MSOU)<br/><i>2003 – 2008</i></p>
    <p>Where young Slava studied the ancient runes of algorithms and the art of logic before venturing into the professional wilderness.</p>`,

    contacts: `<p><strong>📫 Means of Summoning</strong></p>
    <p>Email: <a href="mailto:slava@trofimov.ca">slava@trofimov.ca</a></p>
    <p>LinkedIn: <a href="https://www.linkedin.com/in/slava-trofimov-ca" target="_blank">linkedin.com/in/slava-trofimov-ca</a></p>
    <p>GitHub: <a href="https://github.com/pmbstyle" target="_blank">github.com/pmbstyle</a></p>
    <p>Website: <a href="https://trofimov.ca" target="_blank">trofimov.ca</a></p>
    <p>Should you choose to contact him, send a raven (or, more reliably, an email).</p>`,

    hello: `<h3 class="font-semibold">👋 Hello, traveler!</h3>
    <p>I’m <strong>Slava Trofimov</strong> — Full-Stack AI Engineer, Researcher and simply a nice guy.</p>
    <div style="padding: 10px 0;">
    <p>As you see, this is not a regular website, it has some cool features:</p>
    <p style="padding-left:10px;"><strong>💻 Terminal Mode:</strong> Enter commands to unlock knowledge and secrets of my professional journey.</p>
    <p style="padding-left:10px;"><strong>🧭 Interactive World:</strong> Walk around, chat and battle with NPCs — each tells a piece of my story.</p>
    <p style="padding-left:10px;"><strong>📜 Classic Resume:</strong> For the lore-seekers preferring structured scrolls, download my resume.</p>
    <p style="padding-left:10px;"><strong>🐾 Whiskers the Catbot:</strong> Try to catch him for AI-powered tales and answers.</p>
    </div>
    <p>For those curious about the inner workings, you can find the source code for this website on my <a href="https://github.com/pmbstyle" target="_blank">GitHub Profile page.</a></p>
    <p>May your journey here be bug-free and full of XP. 🌟</p>`,
  }

  const dialogues = ref({
    blacksmith: {
      name: 'blacksmith',
      show: false,
      type: 'skills',
    },
    scarecrow: {
      name: 'scarecrow',
      show: false,
      type: 'experience',
    },
    mailbox: {
      name: 'mailbox',
      show: false,
      type: 'contacts',
    },
    stand: {
      name: 'stand',
      show: false,
      type: 'education',
    },
    statue: {
      name: 'statue',
      show: false,
      type: 'about',
    },
    hello: {
      name: 'hello',
      show: false,
      type: 'hello',
    },
  })

  const names = {
    about: 'Statue',
    skills: 'Blacksmith',
    experience: 'Scarecrow',
    education: 'Bulletin board',
    contacts: 'Mailbox',
  }

  const getDialog = (dialog: keyof typeof content) => {
    return content[dialog]
  }

  const getGameDialog = (type: keyof typeof names) => {
    return {
      name: names[type],
      content: content[type],
    }
  }
  return { getDialog, dialogues, getGameDialog }
})
