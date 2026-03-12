const { z } = require('zod')

const profileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  title: z.string(),
  location: z.object({
    city: z.string(),
    region: z.string(),
    country: z.string(),
    timezone: z.string(),
  }),
  summary: z.string(),
  bio: z.string(),
  yearsOfExperience: z.number().int().nonnegative(),
  focusAreas: z.array(z.string()),
  languages: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
    })
  ),
  interests: z.array(z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      startYear: z.number().int(),
      endYear: z.number().int(),
    })
  ),
  availability: z.object({
    openToRemote: z.boolean(),
    openToHybrid: z.boolean(),
    openToRelocation: z.boolean(),
    interestedIn: z.array(z.string()),
  }),
})

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url(),
  github: z.string().url(),
  linkedin: z.string().url(),
  preferredMethod: z.string(),
  notes: z.array(z.string()),
})

const skillsSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      items: z.array(z.string()),
    })
  ),
})

const experienceItemSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  employmentType: z.string(),
  start: z.string(),
  end: z.string().nullable(),
  summary: z.string(),
  highlights: z.array(z.string()),
  skills: z.array(z.string()),
})

const projectItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  status: z.string(),
  featured: z.boolean(),
  summary: z.string(),
  description: z.string(),
  stack: z.array(z.string()),
  links: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
})

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  tags: z.array(z.string()),
})

const metaSchema = z.object({
  schemaVersion: z.number().int(),
  siteName: z.string(),
  canonicalUrl: z.string().url(),
  agentEntryUrl: z.string().url(),
  lastUpdated: z.string(),
  publicDataOnly: z.boolean(),
})

const contactSubmissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  source: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  honeypot: z.string().max(0).optional(),
})

module.exports = {
  profileSchema,
  contactSchema,
  skillsSchema,
  experienceItemSchema,
  projectItemSchema,
  faqItemSchema,
  metaSchema,
  contactSubmissionSchema,
}
