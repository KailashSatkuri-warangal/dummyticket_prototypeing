export default function AdminLoading() {
  return (
    <div
      className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading admin panel"
    >
      <div className="skeleton h-7 w-64" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-3 h-8 w-28" />
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="space-y-3 border-b border-slate-100 p-4">
          <div className="skeleton h-5 w-40" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="skeleton h-9 w-9 rounded-lg" />
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton hidden h-4 w-24 sm:block" />
              <div className="skeleton h-6 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
