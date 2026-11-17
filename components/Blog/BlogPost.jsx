import Link from 'next/link'

export default function BlogPost({ post }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/blog"
        className="text-sm font-semibold text-leaf-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
      >
        ← All posts
      </Link>
      <time className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-400" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-950">{post.title}</h1>
      <p className="mt-4 text-lg leading-8 text-ink-600">{post.excerpt}</p>
      <div className="mt-8 space-y-5 border-t border-line pt-8">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="text-base leading-8 text-ink-700">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}
