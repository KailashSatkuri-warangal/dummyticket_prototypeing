import { FlightGlobeAnimation } from '@/components/ui/FlightGlobeAnimation';

export default function FlightsLoading() {
  return (
    <div
      className="container-page space-y-6 py-8"
      aria-busy="true"
      aria-label="Loading flight results"
    >
      {/* Globe flight animation banner */}
      <div className="card overflow-hidden bg-gradient-to-b from-blue-50/50 to-white p-6 shadow-card border border-blue-100">
        <FlightGlobeAnimation
          title="Searching Live Flights Across Carriers..."
          subtitle="Querying Indian & global airline GDS systems, fare rules, and seat tiers"
          origin="HYD"
          destination="BOM"
          size="md"
        />
      </div>

      {/* Stepper */}
      <div className="card flex items-center justify-between gap-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="skeleton hidden h-3 w-16 sm:block" />
          </div>
        ))}
      </div>

      {/* Summary banner */}
      <div className="card p-5">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-2 h-7 w-72 max-w-full" />
        <div className="skeleton mt-2 h-3 w-56 max-w-full" />
      </div>

      {/* Filters + results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block">
          <div className="card space-y-4 p-5">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-2 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 border-t border-slate-100 pt-4">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-8 w-full rounded-lg" />
                <div className="skeleton h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-9">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="skeleton h-5 w-64 max-w-[50%]" />
                <div className="skeleton h-5 w-28" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="flex items-center gap-3 lg:col-span-3">
                  <div className="skeleton h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-28" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-2 lg:col-span-5">
                  <div className="space-y-2">
                    <div className="skeleton h-6 w-16" />
                    <div className="skeleton h-3 w-10" />
                  </div>
                  <div className="flex justify-center">
                    <div className="skeleton h-2 w-full" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="skeleton ml-auto h-6 w-16" />
                    <div className="skeleton ml-auto h-3 w-10" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 lg:col-span-4">
                  <div className="skeleton h-8 w-24" />
                  <div className="skeleton h-10 w-32 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
