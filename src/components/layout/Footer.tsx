export function Footer() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-glow)]">
              <span className="h-2 w-2 rounded-full bg-background" />
            </span>
            <span className="font-display text-xl text-foreground">MIRA</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Management Intelligence, Recommendations & Actions. An autonomous office for HR leaders.
          </p>
        </div>
        <Col title="Product" links={["Overview", "Agent Office", "Pricing", "Security"]} />
        <Col title="Company" links={["About", "Blog", "Careers", "Contact"]} />
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} MIRA Labs. All rights reserved.</span>
          <span>Made for HR leaders who prefer decisions over dashboards.</span>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</div>
      <ul className="space-y-2 text-sm text-foreground/80">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="transition hover:text-foreground">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
