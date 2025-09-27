import { PropsWithChildren } from "react";
import NavBar from "@/components/NavBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} HouseKeep. Keeping homes safer, sustainably.
          </p>
          <p>
            Built with care. Privacy-first. Minimal impact.
          </p>
        </div>
      </footer>
    </div>
  );
}
