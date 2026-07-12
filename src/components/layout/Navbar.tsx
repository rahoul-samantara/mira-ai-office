import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/MiraButton";
import { useSignupModal } from "@/components/auth/SignupModalProvider";

export function Navbar() {
  const { open } = useSignupModal();
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <MiraMark />
          <span className="font-display text-xl tracking-tight text-foreground">MIRA</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#product" className="text-sm text-muted-foreground transition hover:text-foreground">
            Product
          </a>
          <a href="#agents" className="text-sm text-muted-foreground transition hover:text-foreground">
            Agents
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-muted-foreground transition hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Sign in
          </Button>
          <Button size="sm" onClick={open}>
            Try for ₹49
          </Button>
        </div>
      </div>
    </header>
  );
}

function MiraMark() {
  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-glow)] shadow-[0_0_20px_-4px_color-mix(in_oklab,var(--brand)_60%,transparent)]">
      <span className="h-2 w-2 rounded-full bg-background" />
    </span>
  );
}
