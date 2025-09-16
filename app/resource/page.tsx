// import { prisma } from '@/lib/prisma'
// import Link from 'next/link'

// export default async function ResourcesPage({
//   searchParams,
// }: {
//   searchParams: { q?: string; category?: string }
// }) {
//   const { q, category } = searchParams
//   const items = await prisma.indicator.findMany({
//     where: {
//       AND: [
//         q
//           ? {
//               OR: [
//                 { shortName: { contains: q, mode: 'insensitive' } },
//                 { description: { contains: q, mode: 'insensitive' } },
//               ],
//             }
//           : {},
//         category ? { indicatorCategories: { has: category as any } } : {},
//       ],
//     },
//     orderBy: { createdAt: 'desc' },
//     include: { organization: true },
//   })

//   return (
//     <section className="space-y-6">
//       <h1 className="text-2xl font-bold text-customNavyTeal">Resources</h1>
//       <form className="flex gap-3">
//         <input
//           name="q"
//           placeholder="Search..."
//           className="w-72 rounded-xl border px-3 py-2"
//           defaultValue={q ?? ''}
//         />
//         <select
//           name="category"
//           defaultValue={category ?? ''}
//           className="rounded-xl border px-3 py-2"
//         >
//           <option value="">All categories</option>
//           <option value="CLIMATE_ADAPTATION">Climate adaptation</option>
//           <option value="CLIMATE_MITIGATION">Climate mitigation</option>
//           <option value="LOSS_DAMAGE_RISK">Loss/damage/risk</option>
//           <option value="OTHER">Other</option>
//         </select>
//         <button className="rounded-xl bg-customTealWhite px-4 py-2 text-white">
//           Filter
//         </button>
//       </form>

//       <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//         {items.map((it) => (
//           <li
//             key={it.id}
//             className="rounded-xl border bg-white p-4 shadow-soft"
//           >
//             <h3 className="line-clamp-1 font-semibold text-customTealWhite">
//               {it.shortName}
//             </h3>
//             <p className="line-clamp-2 text-sm text-slate-600">
//               {it.description ?? '—'}
//             </p>
//             <div className="mt-3 flex justify-between text-sm">
//               <span className="text-customTextDarkTeal/80">
//                 {it.organization?.name ?? 'Unspecified org'}
//               </span>
//               <Link
//                 href={`/resources/${it.id}`}
//                 className="text-customNavyTeal underline"
//               >
//                 Open
//               </Link>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </section>
//   )
// }
