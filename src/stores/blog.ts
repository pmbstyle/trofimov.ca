import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BlogPost {
  slug: string
  meta: {
    title: string
    date: string
    author?: string
    excerpt?: string
  }
  content: string
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const selectedPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const parseFrontmatter = (content: string) => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) {
      return { meta: {}, content: content }
    }

    const [, frontmatterStr, bodyContent] = match
    const meta: Record<string, string> = {}

    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        meta[key.trim()] = valueParts.join(':').trim()
      }
    })

    return {
      meta,
      content: bodyContent.trim(),
    }
  }

  const loadBlogPosts = async () => {
    loading.value = true
    error.value = null

    try {
      // Import all blog markdown files
      const blogModules = import.meta.glob('../blog/*.md', {
        eager: true,
        as: 'raw',
      })
      const loadedPosts: BlogPost[] = []

      for (const [path, content] of Object.entries(blogModules)) {
        const slug = path.replace('../blog/', '').replace('.md', '')

        // Parse frontmatter and content
        const parsed = parseFrontmatter(content as string)

        if (parsed.meta.title && parsed.meta.date) {
          loadedPosts.push({
            slug,
            meta: parsed.meta,
            content: parsed.content,
          })
        }
      }

      // Sort by date (newest first)
      posts.value = loadedPosts.sort(
        (a, b) =>
          new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      )
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to load blog posts'
    } finally {
      loading.value = false
    }
  }

  const selectPost = (post: BlogPost | null) => {
    selectedPost.value = post
  }

  const getPostBySlug = (slug: string) => {
    return posts.value.find(post => post.slug === slug) || null
  }

  return {
    posts,
    selectedPost,
    loading,
    error,
    loadBlogPosts,
    selectPost,
    getPostBySlug,
  }
})
