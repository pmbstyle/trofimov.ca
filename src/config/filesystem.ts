import { html as about } from '@/config/about.md'
import { html as skills } from '@/config/skills.md'
import { html as contact } from '@/config/contact.md'
import { html as experience } from '@/config/experience.md'
import { html as broodmind } from '@/config/broodmind.md'
import { html as alice } from '@/config/alice.md'
import { html as riddi } from '@/config/riddi.md'
import { html as geminiBrowserAgent } from '@/config/gemini-browser-agent.md'
import { html as faraAgent } from '@/config/fara-agent.md'
export interface FileType {
  type: 'folder' | 'file'
  path: string
  name: string
  content?: string
}

const files: FileType[] = [
  {
    type: 'folder',
    path: '~/projects/',
    name: 'projects',
  },
  {
    type: 'file',
    content: broodmind,
    path: '~/projects/',
    name: 'broodmind.md',
  },
  {
    type: 'file',
    content: alice,
    path: '~/projects/',
    name: 'alice.md',
  },
  {
    type: 'file',
    content: riddi,
    path: '~/projects/',
    name: 'riddi.md',
  },
  {
    type: 'file',
    content: geminiBrowserAgent,
    path: '~/projects/',
    name: 'gemini-agent.md',
  },
  {
    type: 'file',
    content: faraAgent,
    path: '~/projects/',
    name: 'fara-agent.md',
  },
  {
    type: 'file',
    content: about,
    path: '~/',
    name: 'about.md',
  },
  {
    type: 'file',
    content: skills,
    path: '~/',
    name: 'skills.md',
  },
  {
    type: 'file',
    content: contact,
    path: '~/',
    name: 'contact.md',
  },
  {
    type: 'file',
    content: experience,
    path: '~/',
    name: 'experience.md',
  },
]

export default files
