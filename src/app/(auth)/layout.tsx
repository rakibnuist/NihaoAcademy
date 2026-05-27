import { Logo } from "@/components/public/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30">
      {/* Minimal header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border py-4 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} NiHao Academy · 你好学院
      </footer>
    </div>
  );
}
