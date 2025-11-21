import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogsStore = defineStore('dialogs', () => {
  const content = {
    about: `<p><strong>📜 A parchment glows faintly...</strong></p>
    <p>You unroll it to reveal tales of <strong>Slava Trofimov</strong>, the <em>Full-Stack Engineer of the North</em>, dwelling in Welland, Ontario.</p>
    <p>For over a decade, he’s traversed the realms of the web, a <strong>Front-end Champion</strong> by origin (Vue, Nuxt, React) and <strong>AI Technomancer</strong> by evolution. With Laravel and Node.js as his twin blades, he forges experiences that blend design, logic, and intelligence.</p>
    <p>In recent quests, he has bound together <strong>OpenAI</strong>, <strong>Anthropic</strong>, and local spellbooks through agentic rituals — LangGraph, CrewAI, RAG, and MCP — breathing cognition into lifeless code.</p>
    <p>Between adventures, Slava roams the wilderness of ideas: gaming realms, distant galaxies, the rhythm of music, and the mysterious frontier of human-machine harmony.</p>
    <p>⚔️ Traveler, should you seek inspiration or wish to trade code-secrets, speak with the NPCs — they guard fragments of his saga.</p>`,

    skills: `<p><strong>🎒 Inventory of Skills</strong></p>
    <ul>
      <li><strong>Front-end Arts:</strong> JavaScript/TypeScript, Vue 3, Nuxt 3 (SSR/SSG), React, Pinia, Vite, TailwindCSS, shadcn/ui, SCSS, Electron, browser extensions, accessibility (WCAG 2.1)</li>
      <li><strong>Back-end Smithing:</strong> Laravel (PHP), Node.js, Python</li>
      <li><strong>DevOps Runes:</strong> Docker + Compose, GitHub Actions, Nginx, Linux</li>
      <li><strong>Data Tomes:</strong> REST, GraphQL, MySQL/PostgreSQL, SQLite</li>
      <li><strong>Testing Guild:</strong> Vitest, Playwright, Cypress — guardians of quality</li>
    </ul>
    <p><strong>🧠 AI & Agentic Magic</strong></p>
    <ul>
      <li>OpenAI / Anthropic / OpenRouter API mastery, with prompt crafting and model orchestration</li>
      <li>RAG architectures powered by vector DBs and rerankers</li>
      <li>LangGraph, CrewAI, MCP servers for multi-tool reasoning</li>
      <li>Speech & vision spells (TTS / STT / Embeddings) for living interfaces</li>
      <li>Local summoning via Ollama + Groq + LM Studio integrations</li>
    </ul>
    <p><em>All these artifacts are maintained, polished, and occasionally enchanted under moonlight.</em></p>`,

    experience: `<p><strong>📖 Chronicle of Adventures</strong></p>
    <p><strong>Senior Full Stack Engineer</strong><br/>
    Jobscan — Seattle, United States (Remote)<br/><i>Feb 2024 – Jul 2025</i></p>
    <ul>
      <li>Led development of flagship features (Vue + Laravel) from first sketch to post-launch polish</li>
      <li>Forged AI pipelines using OpenAI and in-house models — true agentic tool-chains</li>
      <li>Banished elusive bugs haunting both front and back ends</li>
      <li>Summoned Vitest & Playwright test guardians to protect the realm of CI/CD</li>
      <li>Optimized performance and morale alike, surpassing all guild KPIs</li>
    </ul>
  
    <p><strong>Senior Front End Developer</strong><br/>
    codepxl — Toronto, Canada<br/><i>Jan 2019 – Jan 2024</i></p>
    <ul>
      <li>Architected and launched high-performance Vue/Nuxt SSR applications</li>
      <li>Forged reusable component libraries from Figma blueprints</li>
      <li>Led squads through Agile battles, unlocking +30% delivery speed buff</li>
      <li>Balanced magic and logic to keep UX delightful and code elegant</li>
    </ul>
  
    <p><strong>Front End Developer</strong><br/>
    EvolutionInDesignZ — Toronto, Canada<br/><i>May 2018 – Dec 2018</i></p>
    <ul>
      <li>Created cross-realm UIs with Laravel, WordPress, and OpenCart</li>
      <li>Trained in the sacred arts of semantic HTML5 and SASS weaving</li>
      <li>Built Vue + Nuxt + Electron SPAs — small but mighty familiars</li>
    </ul>
  
    <p><em>Earlier Expeditions:</em> Electrolight Ent., iMoan, and Web-Solution LTD, lands where he mastered commerce spells, SEO enchantments, and UI rituals.</p>
    <p><strong>Side Quests:</strong> <a href="https://github.com/pmbstyle/Alice" target="_blank">Alice AI Companion</a>, <a href="https://github.com/pmbstyle/gemini-browser-agent" target="_blank">Gemini Browser Agent</a>, <a href="https://github.com/pmbstyle/openrouter-proxy" target="_blank">OpenRouter Proxy</a>, <a href="https://github.com/pmbstyle/BootVue" target="_blank">BootVue CLI</a>, <a href="https://github.com/pmbstyle/temporal-awareness-mcp" target="_blank">Temporal Awareness MCP</a>.</p>`,

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
    <p>I’m <strong>Slava Trofimov</strong> — Full-Stack Web & AI Engineer, explorer of code and consciousness.</p>
    <div style="padding: 10px 0;">
    <p>This website offers multiple paths:</p>
    <p style="padding-left:10px;"><strong>💻 Terminal Mode:</strong> Enter commands to unlock knowledge and secrets of my journey.</p>
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
