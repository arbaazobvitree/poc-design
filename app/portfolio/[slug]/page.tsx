import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import ProjectGallery from '@/components/ProjectGallery'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), 'content/projects')
  let files: string[] = []
  try {
    files = await fs.readdir(projectsDir)
  } catch {
    return []
  }
  return files
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => ({ slug: f.replace(/\.mdx?$/, '') }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projectsDir = path.join(process.cwd(), 'content/projects')

  let raw: string
  try {
    raw = await fs.readFile(path.join(projectsDir, `${slug}.mdx`), 'utf-8')
  } catch {
    try {
      raw = await fs.readFile(path.join(projectsDir, `${slug}.md`), 'utf-8')
    } catch {
      notFound()
      return null
    }
  }

  const { data, content } = matter(raw)

  return (
    <div className="pt-16">
      {/* Hero */}
      {data.coverImage && (
        <div className="h-[70vh] overflow-hidden">
          <img
            src={data.coverImage}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-light mb-4">{data.title}</h1>
        <hr className="border-[#E8E4DF] mb-6" />

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 text-xs tracking-widest uppercase text-[#9B9690] mb-12 font-[family-name:var(--font-jost)]">
          {data.location && <span>{data.location}</span>}
          {data.year && <span>{data.year}</span>}
          {data.category && <span>{data.category}</span>}
        </div>

        {/* Body */}
        {content && (
          <div className="prose prose-lg max-w-none mb-16 font-[family-name:var(--font-jost)] font-light leading-relaxed">
            {content.split('\n').filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {/* Gallery */}
        {data.gallery && data.gallery.length > 0 && (
          <ProjectGallery gallery={data.gallery} />
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-[#E8E4DF]">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase font-[family-name:var(--font-jost)] text-[#9B9690] hover:text-[#2C2C2C] transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
