import { notFound } from 'next/navigation'
import BlogPost from '@/components/Blog/BlogPost'
import blogs, { getBlogPost } from '@/data/blogs'
import { createPageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  return <BlogPost post={post} />
}
