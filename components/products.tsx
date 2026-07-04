import { Plus } from 'lucide-react'
import { VialImage } from '@/components/products/vial-image'

const PRODUCTS = [
  { name: 'BPC-157', category: 'Recovery', price: '$89', purity: '99.9%' },
  { name: 'TB-500', category: 'Repair', price: '$99', purity: '99.8%' },
  { name: 'Ipamorelin', category: 'Vitality', price: '$79', purity: '99.9%' },
  { name: 'CJC-1295', category: 'Performance', price: '$109', purity: '99.7%' },
]

export function Products() {
  return (
    <section id="products" className="bg-card px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Featured Products
            </span>
            <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
              Explore the compound library
            </h2>
          </div>
          <a
            id="library"
            href="#products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            Browse full library
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className="group rounded-3xl border border-border/60 bg-background p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(8,27,53,0.3)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <VialImage
                    name={product.name}
                    catNo=""
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <span className="absolute left-3 top-3 z-10 rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {product.purity}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  {product.category}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-primary">{product.name}</h3>
                  <span className="font-heading text-lg font-bold text-primary">
                    {product.price}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
