const fs = require('fs')
const path = require('path')

const {
  profileSchema,
  contactSchema,
  skillsSchema,
  experienceItemSchema,
  projectItemSchema,
  faqItemSchema,
  metaSchema,
} = require('./schemas.cjs')

const CONTENT_ROOT = path.join(__dirname, '..', '..', 'content')

function readJson(relativePath) {
  const fullPath = path.join(CONTENT_ROOT, relativePath)
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
}

function readText(relativePath) {
  const fullPath = path.join(CONTENT_ROOT, relativePath)
  return fs.readFileSync(fullPath, 'utf8').trim()
}

function loadContent() {
  const meta = metaSchema.parse(readJson('meta.json'))
  const profile = profileSchema.parse(readJson('profile.json'))
  const contact = contactSchema.parse(readJson('contact.json'))
  const skills = skillsSchema.parse(readJson('skills.json'))
  const experience = experienceItemSchema.array().parse(readJson('experience.json'))
  const projects = projectItemSchema.array().parse(readJson('projects.json'))
  const faq = faqItemSchema.array().parse(readJson('faq.json'))
  const summaries = {
    short: readText(path.join('summaries', 'short.md')),
    recruiter: readText(path.join('summaries', 'recruiter.md')),
    agent: readText(path.join('summaries', 'agent.md')),
  }
  const docs = {
    bio: readText(path.join('docs', 'bio.md')),
    resume: readText(path.join('docs', 'resume.md')),
  }
  const discovery = {
    skill: readText(path.join('skills', 'SKILL.md')),
    llms: readText(path.join('llms', 'llms.txt')),
    llmsFull: readText(path.join('llms', 'llms-full.txt')),
  }

  return {
    meta,
    profile,
    contact,
    skills,
    experience,
    projects,
    faq,
    summaries,
    docs,
    discovery,
  }
}

module.exports = {
  CONTENT_ROOT,
  loadContent,
}
