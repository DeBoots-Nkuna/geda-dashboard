import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-20">
      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight text-customNavyTeal sm:text-5xl">
        About GedA Dashboard
      </h1>

      {/* Intro / About */}
      <section className="mt-6 space-y-4 text-slate-700">
        <p>
          GedA Dashboard is a focused workspace for turning standardized Word
          templates into clean, structured data. It helps you upload documents,
          extract key fields, and present them in a clear, reviewable format so
          teams can collaborate with confidence.
        </p>
        <p>
          The goal is speed and clarity: a simple flow to bring consistent
          indicator data online without complex tooling. You can browse entries
          in the Data Center, filter by categories, and make quick edits via a
          minimal admin step.
        </p>
        <p>
          Under the hood, the app uses a typed data model and a Postgres
          database to keep information reliable and future-proof—so what you
          capture today remains usable for analysis tomorrow.
        </p>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-customNavyTeal">
          How it works
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
          <li>
            <span className="font-medium text-slate-900">
              Upload a .docx template.
            </span>{' '}
            The system reads the document and identifies your key fields.
          </li>
          <li>
            <span className="font-medium text-slate-900">
              Extract & format.
            </span>{' '}
            Checkbox choices and text areas are normalized into a structured
            model.
          </li>
          <li>
            <span className="font-medium text-slate-900">Save & review.</span>{' '}
            The record is stored in the database and shown in the UI for quick
            edits.
          </li>
        </ol>
      </section>

      {/* Ready to get started */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-customNavyTeal">
          Ready to get started
        </h2>
        <p className="mt-3 text-slate-700">
          If you already have a template, upload it now. Otherwise, explore the
          Data Center to see how entries look once they’re in the system.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-customTealWhite px-4 py-2 text-white transition hover:bg-customNavyTeal"
          >
            Upload Data
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-xl border border-customNavyTeal/30 bg-white px-4 py-2 text-customNavyTeal transition hover:bg-customTextNavy/20"
          >
            Explore Data Center
          </Link>
        </div>
      </section>
    </main>
  )
}
