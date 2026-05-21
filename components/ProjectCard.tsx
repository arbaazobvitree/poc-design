import Link from 'next/link'
import { cl } from '@/lib/cloudinary'

interface Props {
  title: string
  location?: string
  category?: string
  coverImage?: string
  slug: string
}

export default function ProjectCard({ title, location, coverImage, slug }: Props) {
  return (
    <Link href={`/portfolio/${slug}`} className="group block">
      <div className="overflow-hidden aspect-[4/3] bg-[#F5F2ED] mb-3">
        {coverImage ? (
          <img
            src={cl(coverImage, 800)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#E8E4DF] flex items-center justify-center text-[#9B9690] text-sm">
            No image
          </div>
        )}
      </div>
      <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-light">{title}</h3>
      {location && (
        <p className="text-xs text-[#9B9690] uppercase tracking-widest mt-1 font-[family-name:var(--font-jost)]">
          {location}
        </p>
      )}
    </Link>
  )
}
