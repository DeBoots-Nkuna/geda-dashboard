export default function HomePage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold text-customNavyTeal">
        Gender & Environment Data (GedA)
      </h1>
      <p className="max-w-2xl text-slate-600">
        Upload indicator documents (.docx), auto-extract fields, and manage them
        in a clean, searchable dashboard.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {['Upload', 'Browse Resources', 'Admin Edit'].map((t, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 shadow-soft">
            <h3 className="font-semibold text-customTealWhite">{t}</h3>
            <p className="text-sm text-slate-600">
              Quick access to common actions.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
