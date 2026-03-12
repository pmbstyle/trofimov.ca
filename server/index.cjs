const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Fastify = require('fastify')

const { loadContent } = require('./lib/content-loader.cjs')
const { searchContent } = require('./lib/search.cjs')
const { buildOpenApiDocument } = require('./lib/openapi.cjs')
const { contactSubmissionSchema } = require('./lib/schemas.cjs')

const app = Fastify({
  logger: false,
})

const PORT = Number(process.env.API_PORT || 4317)
const HOST = process.env.API_HOST || '127.0.0.1'
const RUNTIME_DIR = path.join(__dirname, 'runtime')
const CONTACT_LOG = path.join(RUNTIME_DIR, 'contact-submissions.ndjson')

function getContent() {
  return loadContent()
}

function buildAgentContext(content) {
  return {
    profile: {
      name: content.profile.name,
      headline: content.profile.headline,
      summary: content.profile.summary,
      location: content.profile.location,
      yearsOfExperience: content.profile.yearsOfExperience,
    },
    focusAreas: content.profile.focusAreas,
    topSkills: content.skills.categories.slice(0, 4),
    recentExperience: content.experience.slice(0, 3),
    featuredProjects: content.projects.filter(project => project.featured),
    contact: {
      email: content.contact.email,
      website: content.contact.website,
      github: content.contact.github,
      linkedin: content.contact.linkedin,
    },
    guidance: {
      bestSummaryEndpoint: '/api/summary?audience=agent',
      searchEndpoint: '/api/search?q=...',
      skillDocument: '/SKILL.md',
    },
  }
}

app.addHook('onSend', async (request, reply, payload) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Headers', 'Content-Type')
  reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  return payload
})

app.options('*', async (request, reply) => {
  reply.code(204).send()
})

app.get('/health', async () => ({
  ok: true,
  service: 'trofimov-ca-public-api',
}))

app.get('/api/profile', async () => getContent().profile)

app.get('/api/contact-info', async () => getContent().contact)

app.get('/api/skills', async () => getContent().skills)

app.get('/api/experience', async () => getContent().experience)

app.get('/api/projects', async () => getContent().projects)

app.get('/api/projects/:slug', async (request, reply) => {
  const { slug } = request.params
  const project = getContent().projects.find(item => item.slug === slug)

  if (!project) {
    reply.code(404).send({ error: 'Project not found' })
    return
  }

  return project
})

app.get('/api/faq', async () => getContent().faq)

app.get('/api/context', async () => buildAgentContext(getContent()))

app.get('/api/summary', async request => {
  const audience = String(request.query.audience || 'agent')
  const content = getContent()

  if (audience === 'recruiter') {
    return { audience, content: content.summaries.recruiter }
  }

  if (audience === 'short') {
    return { audience, content: content.summaries.short }
  }

  return { audience: 'agent', content: content.summaries.agent }
})

app.get('/api/search', async request => {
  const q = String(request.query.q || '')
  const results = searchContent(getContent(), q)

  return {
    query: q,
    count: results.length,
    results,
  }
})

app.get('/SKILL.md', async (request, reply) => {
  reply.type('text/markdown; charset=utf-8')
  return getContent().discovery.skill
})

app.get('/llms.txt', async (request, reply) => {
  reply.type('text/plain; charset=utf-8')
  return getContent().discovery.llms
})

app.get('/llms-full.txt', async (request, reply) => {
  reply.type('text/plain; charset=utf-8')
  return getContent().discovery.llmsFull
})

app.get('/openapi.json', async () => buildOpenApiDocument())

app.post('/api/contact', async (request, reply) => {
  const parsed = contactSubmissionSchema.safeParse(request.body || {})

  if (!parsed.success) {
    reply.code(400).send({
      error: 'Invalid contact payload',
      details: parsed.error.flatten(),
    })
    return
  }

  if (parsed.data.honeypot) {
    reply.code(400).send({ error: 'Spam detected' })
    return
  }

  fs.mkdirSync(RUNTIME_DIR, { recursive: true })

  const submission = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    ...parsed.data,
  }

  fs.appendFileSync(CONTACT_LOG, JSON.stringify(submission) + '\n', 'utf8')

  reply.code(202).send({
    ok: true,
    id: submission.id,
    receivedAt: submission.receivedAt,
    storage: 'local-file',
  })
})

app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.code(500).send({
    error: 'Internal server error',
    message: error.message,
  })
})

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    console.log(`Public API running at http://${HOST}:${PORT}`)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
