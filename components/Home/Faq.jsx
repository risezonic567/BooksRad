'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import faqs from '@/data/faqs'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="home-faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="home-faq-heading" className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Questions before you search
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-600">
            Straight answers on offers, passengers, and how booking requests work.
          </p>
        </div>

        <div className="mt-10 border-t border-line">
          {faqs.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="font-display text-[1.05rem] font-semibold text-ink-950">{item.q}</span>
                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-ink-500 transition-transform duration-300 ease-out ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`pb-5 pr-8 text-sm leading-7 text-ink-600 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
