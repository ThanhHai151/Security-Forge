import { useState } from "react";
import {
  GithubLogo,
  EnvelopeSimple,
  Globe,
  GitBranch,
  LinkedinLogo,
  XLogo,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Wrench,
  Circle,
  Check,
  CheckCircle,
} from "@phosphor-icons/react";

import { profile } from "../content/profile";
import { stats } from "../content/catalog";
import { toolStats } from "../content/tools";
import { loc } from "../lib/loc";

const LINK_ICONS = {
  github: GithubLogo,
  mail: EnvelopeSimple,
  globe: Globe,
  repo: GitBranch,
  linkedin: LinkedinLogo,
  twitter: XLogo,
};

function initials(name) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  // First + last word — for "Huỳnh Thanh Hải" → "HH" (family + given name).
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col">
      <span className="text-[2rem] font-bold text-emerald-400 tabular-nums leading-none">
        {value}
      </span>
      <span className="mt-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}

function isExternal(href) {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:");
}

const LINK_CLASS =
  "inline-flex items-center gap-2 px-3 py-1.5 border border-white/[0.08] bg-zinc-900/50 text-[13px] text-zinc-300 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors";

function ProfileLink({ link }) {
  const Icon = LINK_ICONS[link.icon] ?? Globe;
  const [copied, setCopied] = useState(false);

  // The email link copies the address to the clipboard instead of opening a mail client.
  if (link.icon === "mail" || link.href.startsWith("mailto:")) {
    const email = link.href.replace(/^mailto:/, "");
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        /* clipboard unavailable — no-op */
      }
    };
    return (
      <button
        type="button"
        onClick={copy}
        title={copied ? "Copied to clipboard" : `Copy ${email}`}
        className={LINK_CLASS}
      >
        {copied ? <Check size={15} className="text-emerald-400" /> : <Icon size={15} weight="fill" />}
        {copied ? email : link.label}
      </button>
    );
  }

  const ext = isExternal(link.href);
  return (
    <a
      href={link.href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className={LINK_CLASS}
    >
      <Icon size={15} weight="fill" />
      {link.label}
      {ext && <ArrowUpRight size={12} className="text-zinc-600" />}
    </a>
  );
}

function FocusCard({ title, detail }) {
  return (
    <section className="border border-white/[0.07] bg-zinc-900/30 p-4">
      <h3 className="text-[13px] font-semibold text-zinc-200 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 shrink-0" style={{ boxShadow: "0 0 6px rgba(34,184,144,0.7)" }} />
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{detail}</p>
    </section>
  );
}

function BuildingRow({ item, t, locale }) {
  const live = item.status === "live";
  const StatusIcon = live ? CheckCircle : Circle;
  const inner = (
    <>
      <StatusIcon
        size={15}
        weight={live ? "fill" : "regular"}
        className={live ? "text-emerald-400 shrink-0" : "text-zinc-600 shrink-0"}
      />
      <span className="flex-1 min-w-0">
        <span className="text-[13.5px] text-zinc-200 group-hover:text-zinc-50">{loc(item.title, locale)}</span>
        <span className="block text-[12.5px] text-zinc-500 truncate">{loc(item.detail, locale)}</span>
      </span>
      <span
        className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 border shrink-0 ${
          live
            ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/10"
            : "text-zinc-500 border-white/[0.08] bg-zinc-900/60"
        }`}
      >
        {live ? t.live : t.planned}
      </span>
      {item.to && (
        <ArrowRight size={14} className="text-zinc-700 group-hover:text-emerald-400 transition-colors shrink-0" />
      )}
    </>
  );

  const className = "nav-row group w-full flex items-center gap-3 px-4 py-3 text-left";
  return item.to ? (
    <a href={item.to} className={className}>
      {inner}
    </a>
  ) : (
    <div className={`${className} cursor-default`}>{inner}</div>
  );
}

export default function Dashboard({ t, locale }) {
  const p = profile;

  return (
    <div className="page-enter mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-10">
      {/* ── Hero ── */}
      <header className="flex flex-col sm:flex-row gap-7 sm:items-start">
        <div
          className="w-20 h-20 shrink-0 flex items-center justify-center bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-[1.9rem] font-bold tracking-tight"
          aria-hidden="true"
        >
          {initials(p.name)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400/80">
            {t.profileKicker}
          </p>
          <h1 className="mt-2 text-[2.1rem] sm:text-[2.6rem] font-bold text-zinc-50 tracking-tight leading-[1.05]">
            {p.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
            <span className="font-mono text-zinc-400">@{p.handle}</span>
            <span className="text-zinc-300">{loc(p.role, locale)}</span>
            {p.location && (
              <span className="inline-flex items-center gap-1 text-zinc-500">
                <MapPin size={13} weight="fill" className="text-zinc-600" />
                {p.location}
              </span>
            )}
            {p.available && (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500" style={{ boxShadow: "0 0 7px rgba(34,184,144,0.9)" }} />
                {t.available}
              </span>
            )}
          </div>

          <p className="mt-5 text-[1.05rem] leading-relaxed text-zinc-300 max-w-[60ch]">
            {loc(p.tagline, locale)}
          </p>

          {/* Links */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {p.links.map((link) => (
              <ProfileLink key={link.label} link={link} />
            ))}
          </div>
        </div>
      </header>

      {/* ── Stats ── */}
      <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 pb-9 border-b border-white/[0.06]">
        <Stat value={stats.total} label={t.statClasses} />
        <Stat value={stats.categories} label={t.statCategories} />
        <Stat value={toolStats.total} label={t.statTools} />
        <Stat value={toolStats.phases} label={t.statPhases} />
      </div>

      {/* ── About ── */}
      <section className="mt-9">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2.5">
          <span className="w-4 h-px bg-emerald-500/60" />
          {t.about}
        </h2>
        <div className="space-y-4 max-w-[72ch]">
          {loc(p.bio, locale).map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-zinc-300">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── Focus areas ── */}
      <section className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2.5">
          <span className="w-4 h-px bg-emerald-500/60" />
          {t.focusAreas}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {p.focus.map((f) => (
            <FocusCard key={f.title.en} title={loc(f.title, locale)} detail={loc(f.detail, locale)} />
          ))}
        </div>
      </section>

      {/* ── Building ── */}
      <section className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2.5">
          <span className="w-4 h-px bg-emerald-500/60" />
          {t.building}
        </h2>
        <div className="border border-white/[0.07] bg-zinc-900/30 divide-y divide-white/[0.05]">
          {p.building.map((item) => (
            <BuildingRow key={item.title.en} item={item} t={t} locale={locale} />
          ))}
        </div>
      </section>

      {/* ── Quick links into the rest of the app ── */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="#/docs"
          className="group border border-white/[0.07] bg-zinc-900/30 p-5 hover:border-emerald-400/40 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-zinc-200 group-hover:text-emerald-400 transition-colors">
            <BookOpen size={18} weight="fill" className="text-emerald-400" />
            <span className="text-[15px] font-semibold">{t.navDocs}</span>
            <ArrowRight size={15} className="ml-auto text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="mt-2 text-[13px] text-zinc-400">{t.docsBlurb}</p>
        </a>
        <a
          href="#/pentest"
          className="group border border-white/[0.07] bg-zinc-900/30 p-5 hover:border-emerald-400/40 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-zinc-200 group-hover:text-emerald-400 transition-colors">
            <Wrench size={18} weight="fill" className="text-emerald-400" />
            <span className="text-[15px] font-semibold">{t.navPentest}</span>
            <ArrowRight size={15} className="ml-auto text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="mt-2 text-[13px] text-zinc-400">{t.pentestBlurb}</p>
        </a>
      </section>

      <footer className="mt-10 pt-5 border-t border-white/[0.06] text-[12px] text-zinc-500">
        {t.authNote}
      </footer>
    </div>
  );
}
