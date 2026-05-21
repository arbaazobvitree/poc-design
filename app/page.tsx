import ProjectGrid from '@/components/ProjectGrid'

// Fetch projects at build time via local TinaCMS filesystem
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function getProjects() {
  const projectsDir = path.join(process.cwd(), 'content/projects')
  let files: string[] = []
  try {
    files = await fs.readdir(projectsDir)
  } catch {
    return []
  }
  const projects = await Promise.all(
    files
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(projectsDir, file), 'utf-8')
        const { data } = matter(raw)
        return {
          _sys: { filename: file.replace(/\.mdx?$/, '') },
          title: data.title ?? 'Untitled',
          location: data.location ?? null,
          category: data.category ?? null,
          coverImage: data.coverImage ?? null,
        }
      })
  )
  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div>
      {/* Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600"
          alt="Interior design studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Spaces that tell your story.
          </h1>
          <p className="text-lg font-[family-name:var(--font-jost)] font-light opacity-80">
            A full-service interior design studio.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="pt-24 pb-16 px-6 md:px-12">
        <h2 className="text-3xl font-light mb-12 text-center tracking-wide">Selected Work</h2>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  )
}
