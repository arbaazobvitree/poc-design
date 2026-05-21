import { cl } from '@/lib/cloudinary'

interface GalleryItem {
  image?: string | null
  caption?: string | null
}

export default function ProjectGallery({ gallery }: { gallery: GalleryItem[] }) {
  if (!gallery || gallery.length === 0) return null

  return (
    <div className="space-y-2">
      {gallery.map((item, i) => (
        item.image && (
          <div key={i}>
            <img
              src={cl(item.image, 1200)}
              alt={item.caption || `Gallery photo ${i + 1}`}
              className="w-full"
              loading="lazy"
            />
            {item.caption && (
              <p className="text-sm text-[#9B9690] italic mt-2 font-[family-name:var(--font-jost)]">
                {item.caption}
              </p>
            )}
          </div>
        )
      ))}
    </div>
  )
}
