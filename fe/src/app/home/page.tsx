const howItWorks = [
  {
    step: "1",
    title: "Pick your academic path",
    text: "Filter by University, Faculty, and Subject to discover listings relevant to your semester.",
  },
  {
    step: "2",
    title: "Chat and negotiate",
    text: "Message sellers directly to agree on pricing, renting period, and meetup location.",
  },
  {
    step: "3",
    title: "Complete safely",
    text: "Choose Meeting on Campus or COD Delivery and track your transaction flow.",
  },
];

const deals = [
  {
    title: "Signals & Systems textbook",
    price: "180,000 VND",
    meta: "HCMUT · Electrical Engineering",
    tag: "Hot",
  },
  {
    title: "Lab Coat rental (1 month)",
    price: "60,000 VND",
    meta: "HCMUS · Chemistry",
    tag: "Popular",
  },
  {
    title: "Old Midterm Bundle (PDF)",
    price: "35,000 VND",
    meta: "UEH · Macroeconomics",
    tag: "Digital",
  },
];

export default function HomeFeedPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-ocean-700">EduCart Home Feed</p>
        <h1 className="font-display text-4xl font-bold text-slate-900">How it works</h1>
        <p className="max-w-3xl text-slate-700">
          EduCart connects students across campuses to reuse academic resources, save money, and keep useful materials in circulation.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {howItWorks.map((item) => (
          <article key={item.step} className="glass-card rounded-2xl p-5">
            <p className="font-display text-2xl font-bold text-ocean-700">{item.step}</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-slate-900">Trending Deals</h2>
          <a href="#" className="text-sm font-semibold text-ocean-700 hover:text-ocean-500">View all</a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <article key={deal.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="inline-block rounded-full bg-gold-400/20 px-3 py-1 text-xs font-semibold text-amber-700">
                {deal.tag}
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{deal.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{deal.meta}</p>
              <p className="mt-4 text-xl font-bold text-ocean-700">{deal.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
