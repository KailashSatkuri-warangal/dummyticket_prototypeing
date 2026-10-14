export default function AccountLoading() {
  return (
    <div
      className="container-page space-y-6 py-8"
      aria-busy="true"
      aria-label="Loading account"
    >
      <div className="skeleton h-7 w-56" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton mt-3 h-7 w-24" />
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="skeleton h-5 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="skeleton h-4 w-48 max-w-[60%]" />
              <div className="skeleton h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
