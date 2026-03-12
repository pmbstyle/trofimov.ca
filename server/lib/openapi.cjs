function buildOpenApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Slava Trofimov Public Profile API',
      version: '0.1.0',
      description:
        'Public machine-readable profile API for trofimov.ca. Designed for agents, recruiters, and other clients that need structured public information without scraping the website UI.',
    },
    servers: [
      {
        url: '/',
      },
    ],
    tags: [
      { name: 'discovery', description: 'Files that help agents discover and use the API' },
      { name: 'profile', description: 'Public profile and context endpoints' },
      { name: 'contact', description: 'Public contact retrieval and message submission' },
    ],
    paths: {
      '/api/profile': {
        get: {
          tags: ['profile'],
          summary: 'Get public profile',
          description: 'Returns identity, summary, focus areas, education, location, and availability information.',
        },
      },
      '/api/contact-info': {
        get: {
          tags: ['contact'],
          summary: 'Get public contact information',
          description: 'Returns public professional contact details such as email, website, GitHub, and LinkedIn.',
        },
      },
      '/api/skills': {
        get: {
          tags: ['profile'],
          summary: 'Get grouped skill data',
          description: 'Returns skills grouped by category such as frontend, backend, AI, data, quality, and devops.',
        },
      },
      '/api/experience': {
        get: {
          tags: ['profile'],
          summary: 'Get work history',
          description: 'Returns recent professional experience with summaries, highlights, and technology tags.',
        },
      },
      '/api/projects': {
        get: {
          tags: ['profile'],
          summary: 'Get projects',
          description: 'Returns public projects with summaries, tags, links, and stack information.',
        },
      },
      '/api/projects/{slug}': {
        get: {
          tags: ['profile'],
          summary: 'Get a single project by slug',
          description: 'Returns a single public project record for a known slug.',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        },
      },
      '/api/faq': {
        get: {
          tags: ['profile'],
          summary: 'Get FAQ entries',
          description: 'Returns common questions and answers about role fit, strengths, and hiring context.',
        },
      },
      '/api/context': {
        get: {
          tags: ['profile'],
          summary: 'Get compact agent-ready context',
          description: 'Best first endpoint for agents. Returns a condensed profile snapshot, skills, experience, projects, and contact links.',
        },
      },
      '/api/summary': {
        get: {
          tags: ['profile'],
          summary: 'Get a prebuilt summary',
          description: 'Returns a concise summary for a given audience such as agent, recruiter, or short.',
          parameters: [
            {
              name: 'audience',
              in: 'query',
              schema: { type: 'string', enum: ['agent', 'recruiter', 'short'] },
            },
          ],
        },
      },
      '/api/search': {
        get: {
          tags: ['profile'],
          summary: 'Search across public profile data',
          description: 'Searches across profile, projects, experience, FAQ, and summaries.',
          parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
        },
      },
      '/api/contact': {
        post: {
          tags: ['contact'],
          summary: 'Submit a public contact request',
          description: 'Accepts a public contact request. Intended for explicit message sending, not data retrieval.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'subject', 'message'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    subject: { type: 'string' },
                    message: { type: 'string' },
                    source: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      '/SKILL.md': {
        get: {
          tags: ['discovery'],
          summary: 'Agent skill instructions',
          description: 'Primary human-readable operational guide for agents using this public profile API.',
        },
      },
      '/llms.txt': {
        get: {
          tags: ['discovery'],
          summary: 'LLM discovery file',
          description: 'Short machine-oriented entrypoint for agents and LLM clients.',
        },
      },
      '/llms-full.txt': {
        get: {
          tags: ['discovery'],
          summary: 'Expanded LLM discovery file',
          description: 'Longer machine-oriented guide with usage recommendations and endpoint descriptions.',
        },
      },
      '/openapi.json': {
        get: {
          tags: ['discovery'],
          summary: 'OpenAPI schema',
          description: 'Machine-readable schema for the public profile API.',
        },
      },
    },
  }
}

module.exports = {
  buildOpenApiDocument,
}
