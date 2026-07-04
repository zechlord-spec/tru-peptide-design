import { Layers, Sparkles, Info } from 'lucide-react'
import { getSystemRecommendations } from '@/lib/catalog/recommendations'
import { RecommendationCard } from './recommendation-card'
import { StackCard } from './stack-card'

export async function SystemRecommendations({
  systemSlug,
  systemName,
}: {
  systemSlug: string
  systemName: string
}) {
  const { products, stacks, note, tags } = await getSystemRecommendations(systemSlug)

  return (
    <div className="flex flex-col gap-14">
      {/* Educational note */}
      {note.trim() && (
        <aside className="flex gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
          <Info className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-primary/90">{note}</p>
        </aside>
      )}

      {/* Recommended Stacks */}
      {stacks.length > 0 && (
        <section aria-labelledby="stacks-heading">
          <div className="mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 id="stacks-heading" className="font-heading text-2xl font-bold text-primary">
              Recommended Stacks
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Curated combinations designed to work together. Add a complete protocol to your cart in
            one click, or build your own from the products below.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <StackCard key={stack.id} stack={stack} />
            ))}
          </div>
        </section>
      )}

      {/* Ranked product grid */}
      <section aria-labelledby="products-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 id="products-heading" className="font-heading text-2xl font-bold text-primary">
              {systemName} Products
            </h2>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <RecommendationCard key={item.product.slug} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No products are currently tagged for this system.
          </p>
        )}
      </section>
    </div>
  )
}
