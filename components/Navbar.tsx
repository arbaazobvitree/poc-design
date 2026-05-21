import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E4DF] px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-[family-name:var(--font-cormorant)] tracking-widest uppercase">
        Studio POC
      </Link>
      <div className="flex gap-8 text-xs tracking-widest uppercase font-[family-name:var(--font-jost)]">
        <Link href="/" className="hover:text-[#8B7355] transition-colors">Portfolio</Link>
        <Link href="/portfolio" className="hover:text-[#8B7355] transition-colors">All Work</Link>
      </div>
    </nav>
  )
}
