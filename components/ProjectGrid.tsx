'use client'

import { useState } from 'react'
import ProjectCard from './ProjectCard'

const FILTERS = ['All', 'Residential', 'Commercial']

interface Project {
  _sys: { filename: string }
  title: string
  location?: string | null
  category?: string | null
  coverImage?: string | null
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === active.toLowerCase())

  return (
    <div>
      <div className="flex gap-6 justify-center mb-10 font-[family-name:var(--font-jost)] text-xs tracking-widest uppercase">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`pb-1 transition-colors ${
              active === f
                ? 'border-b border-[#2C2C2C] text-[#2C2C2C]'
                : 'text-[#9B9690] hover:text-[#2C2C2C]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(project => (
          <ProjectCard
            key={project._sys.filename}
            slug={project._sys.filename}
            title={project.title}
            location={project.location ?? undefined}
            category={project.category ?? undefined}
            coverImage={project.coverImage ?? undefined}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#9B9690] py-16 font-[family-name:var(--font-jost)]">
          No projects in this category yet.
        </p>
      )}
    </div>
  )
}
