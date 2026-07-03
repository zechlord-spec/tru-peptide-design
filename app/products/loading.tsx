import { CardGridSkeleton } from '@/components/animations/loaders'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-4 pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 flex max-w-xl flex-col items-center gap-4">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-10 w-72" />
          <div className="skeleton h-4 w-full max-w-md" />
        </div>
        <CardGridSkeleton count={9} />
      </div>
    </div>
  )
}
