import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "text-primary-foreground bg-primary"
        : "text-foreground/80 hover:text-foreground hover:bg-accent"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
          <span className="font-extrabold tracking-tight text-lg">HouseKeep</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
          <NavLink to="/tracker" className={linkClass}>
            Tracker
          </NavLink>
          <NavLink to="/plans" className={linkClass}>
            Future Plans
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/profile">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
