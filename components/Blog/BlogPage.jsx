import Link from 'next/link'
import blogs from '@/data/blogs'

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf-600">Blog</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink-950">Flight tips from the desk</h1>
        <p className="mt-4 text-base leading-7 text-ink-600">
          Short reads on comparing offers, trip types, and cabins.
        </p>
      </div>

      <ul className="mt-10 divide-y divide-line border-y border-line">
        {blogs.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
            >
              <time className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink-950 group-hover:text-leaf-700">{post.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
