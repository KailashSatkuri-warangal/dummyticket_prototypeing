import { FlightGlobeAnimation } from '@/components/ui/FlightGlobeAnimation';

export default function RootLoading() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading page">
      <FlightGlobeAnimation
        title="Loading Flight & Studio Services..."
        subtitle="Initializing live routes, verified inventory, and platform settings"
        origin="HYD"
        destination="DEL"
        size="md"
        className="mb-6"
      />
      <div className="skeleton h-6 w-48" />
      <div className="skeleton mt-3 h-10 w-full max-w-xl" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton mt-3 h-5 w-3/4" />
            <div className="skeleton mt-2 h-3 w-full" />
            <div className="skeleton mt-2 h-3 w-5/6" />
            <div className="skeleton mt-4 h-8 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

