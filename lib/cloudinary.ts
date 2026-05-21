export function cl(url: string, width = 800): string {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}
