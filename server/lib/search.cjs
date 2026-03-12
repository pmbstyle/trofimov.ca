function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function includesToken(haystack, token) {
  return haystack.includes(token)
}

function scoreText(text, tokens) {
  const lowered = text.toLowerCase()
  let score = 0

  for (const token of tokens) {
    if (includesToken(lowered, token)) {
      score += token.length > 4 ? 3 : 2
    }
  }

  if (tokens.length && includesToken(lowered, tokens.join(' '))) {
    score += 5
  }

  return score
}

function makeSnippet(text, query) {
  const lowered = text.toLowerCase()
  const index = lowered.indexOf(query.toLowerCase())

  if (index === -1) {
    return text.slice(0, 180)
  }

  const start = Math.max(0, index - 50)
  const end = Math.min(text.length, index + 130)
  return text.slice(start, end).trim()
}

function buildDocuments(content) {
  const docs = []

  docs.push({
    type: 'profile',
    id: 'profile',
    title: content.profile.name,
    text: [content.profile.headline, content.profile.summary, content.profile.bio, ...content.profile.focusAreas].join(' '),
    url: '/api/profile',
  })

  for (const item of content.experience) {
    docs.push({
      type: 'experience',
      id: item.id,
      title: `${item.role} at ${item.company}`,
      text: [item.summary, ...item.highlights, ...item.skills].join(' '),
      url: '/api/experience',
    })
  }

  for (const item of content.projects) {
    docs.push({
      type: 'project',
      id: item.slug,
      title: item.name,
      text: [item.summary, item.description, ...item.stack, ...item.tags].join(' '),
      url: `/api/projects/${item.slug}`,
    })
  }

  for (const item of content.faq) {
    docs.push({
      type: 'faq',
      id: item.question,
      title: item.question,
      text: `${item.question} ${item.answer} ${item.tags.join(' ')}`,
      url: '/api/faq',
    })
  }

  docs.push({
    type: 'summary',
    id: 'agent-summary',
    title: 'Agent Summary',
    text: content.summaries.agent,
    url: '/api/summary?audience=agent',
  })

  return docs
}

function searchContent(content, query) {
  const normalized = (query || '').trim()
  if (!normalized) {
    return []
  }

  const tokens = tokenize(normalized)
  const documents = buildDocuments(content)

  return documents
    .map(document => {
      const score = scoreText(document.title, tokens) * 2 + scoreText(document.text, tokens)
      return {
        ...document,
        score,
        snippet: makeSnippet(document.text, normalized),
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

module.exports = {
  searchContent,
}
