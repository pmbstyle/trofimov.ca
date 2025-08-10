<template>
  <perfect-scrollbar ref="blogScroll" class="blog-container">
    <article class="blog">
      <div v-if="!selectedPost" class="blog-list">
        <h1>
          Blog
          <span>({{ sortedPosts.length }} posts)</span>
        </h1>
        <p>
          <strong>Thoughts, tutorials, and insights on web development</strong>
        </p>

        <section v-if="loading">
          <p>Loading blog posts...</p>
        </section>

        <section v-else-if="error">
          <p><strong>Error:</strong> {{ error }}</p>
        </section>

        <section v-else-if="sortedPosts.length === 0">
          <p>No posts available yet. Check back later for new content!</p>
        </section>

        <section v-else>
          <p class="dashed"><strong>Recent Posts</strong></p>
          <div class="my-4 py-2" v-for="post in sortedPosts" :key="post.slug">
            <b @click="selectPost(post)" class="blog-post-title">
              {{ post.meta.title }} </b
            ><br />
            <small>{{ formatDate(post.meta.date) }}</small>
            <span v-if="post.meta.author"
              ><br /><small>by {{ post.meta.author }}</small></span
            >
            <p v-if="post.meta.excerpt">{{ post.meta.excerpt }}</p>
          </div>
        </section>
      </div>

      <div v-else class="blog-post">
        <p class="back-link">
          <a @click="navigateToList" href="#">← Back to Blog</a>
        </p>

        <h1>{{ selectedPost.meta.title }}</h1>
        <p>
          <small>{{ formatDate(selectedPost.meta.date) }}</small>
          <span v-if="selectedPost.meta.author"
            ><br /><small>by {{ selectedPost.meta.author }}</small></span
          >
        </p>

        <section>
          <div class="blog-content" v-html="selectedPost.content"></div>
        </section>
      </div>
    </article>
  </perfect-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import vue from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import php from 'highlight.js/lib/languages/php'
import python from 'highlight.js/lib/languages/python'
import html from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('vue', vue)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('sass', scss)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('php', php)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html)

interface Props {
  initialSlug?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialSlug: undefined
})

const router = useRouter()

interface BlogPost {
  slug: string
  meta: {
    title: string
    date: string
    author?: string
    excerpt?: string
  }
  content: string
}

const posts = ref<BlogPost[]>([])
const selectedPost = ref<BlogPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const sortedPosts = computed(() => {
  return posts.value.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  )
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const selectPost = async (post: BlogPost) => {
  const processedPost = {
    ...post,
    content: removeDuplicateHeader(post.content)
  }
  
  selectedPost.value = processedPost
  router.push(`/blog/${post.slug}`)
  
  await nextTick()
  highlightCodeBlocks()
}

const navigateToList = () => {
  selectedPost.value = null
  router.push('/blog')
}

const removeDuplicateHeader = (content: string) => {
  return content.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, '')
}

const highlightCodeBlocks = () => {
  const preBlocks = document.querySelectorAll('.blog-content pre')
  preBlocks.forEach((pre) => {
    const code = pre.querySelector('code')
    if (!code) return
    
    const className = code.className
    let language = ''
    
    const langMatch = className.match(/language-(\w+)/)
    if (langMatch) {
      language = langMatch[1]
      pre.setAttribute('data-language', language)
    }
    
    hljs.highlightElement(code as HTMLElement)
    
    if (!pre.querySelector('.copy-button')) {
      addCopyButton(pre as HTMLElement, code.textContent || '')
    }
  })
}

const addCopyButton = (pre: HTMLElement, code: string) => {
  const button = document.createElement('button')
  button.className = 'copy-button'
  button.innerHTML = '📋'
  button.title = 'Copy code'
  
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code)
      button.innerHTML = '✅'
      button.title = 'Copied!'
      setTimeout(() => {
        button.innerHTML = '📋'
        button.title = 'Copy code'
      }, 2000)
    } catch (err) {
      button.innerHTML = '❌'
      setTimeout(() => {
        button.innerHTML = '📋'
      }, 2000)
    }
  })
  
  pre.appendChild(button)
}

const loadBlogPosts = async () => {
  loading.value = true
  error.value = null

  try {
    const blogModules = import.meta.glob('../blog/*.md', { eager: true })
    const loadedPosts: BlogPost[] = []

    for (const [path, module] of Object.entries(blogModules)) {
      const slug = path.replace('../blog/', '').replace('.md', '')
      const blogModule = module as any
      const meta = blogModule.attributes || {}
      const content = blogModule.html || ''

      if (meta.title && meta.date) {
        loadedPosts.push({
          slug,
          meta,
          content,
        })
      }
    }

    posts.value = loadedPosts
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load blog posts'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadBlogPosts()
  
  if (props.initialSlug && posts.value.length > 0) {
    const post = posts.value.find(p => p.slug === props.initialSlug)
    if (post) {
      await selectPost(post)
    }
  }
})
</script>

