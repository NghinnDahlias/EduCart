"use client";

import Link from "next/link";

import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import { useLocale } from "@/components/locale-provider";

interface InfoPageShellProps {
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    items: string[];
  }>;
}

export default function InfoPageShell({
  title,
  description,
  sections,
}: InfoPageShellProps) {
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              {locale === "vi" ? "Trang chủ" : "Home"}
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-900">{title}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sections.map((section) => (
            <article key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
