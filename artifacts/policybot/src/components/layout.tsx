import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, List, Scale, Lightbulb, ShieldCheck,
  BarChart2, Zap, Bookmark, Menu, X,
  ChevronLeft, ChevronRight, Activity,
} from "lucide-react";

const navItems = [
  { href: "/",          label: "Consultation",     icon: Search },
  { href: "/schemes",   label: "Browse Schemes",   icon: List },
  { href: "/compare",   label: "Compare",          icon: Scale },
  { href: "/recommend", label: "Recommendations",  icon: Lightbulb },
  { href: "/verify",    label: "Fact Check",       icon: ShieldCheck },
  { href: "/impact",    label: "Impact Simulator", icon: Zap },
  { href: "/bookmarks", label: "My Policies",      icon: Bookmark },
  { href: "/analytics", label: "Analytics",        icon: BarChart2 },
  { href: "/audit",     label: "System Audit",     icon: Activity },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Desktop sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col sticky top-0 h-screen
          bg-sidebar border-r border-sidebar-border text-sidebar-foreground
          transition-all duration-300 ease-in-out shrink-0 overflow-hidden
          ${collapsed ? "w-[60px]" : "w-[230px]"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center shrink-0 h-14 border-b border-sidebar-border ${collapsed ? "justify-center px-0" : "px-4"}`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs leading-none">N</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold tracking-tight text-sidebar-foreground">NitiAI</div>
                <div className="text-[9px] text-sidebar-foreground/40 uppercase tracking-widest leading-none">Policy Intelligence</div>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            className={`
              shrink-0 rounded-md p-1 transition-colors
              hover:bg-sidebar-accent/60 text-sidebar-foreground/50 hover:text-sidebar-foreground
              ${collapsed ? "absolute right-1 top-3.5" : "ml-auto"}
            `}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-px px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`
                  flex items-center gap-2.5 rounded-md transition-colors text-sm
                  ${collapsed ? "justify-center px-0 py-2" : "px-2.5 py-2"}
                  ${active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer branding when collapsed */}
        {collapsed && (
          <div className="shrink-0 py-3 flex justify-center border-t border-sidebar-border">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-md hover:bg-sidebar-accent/60 text-sidebar-foreground/40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2.5 h-14 px-4 border-b border-sidebar-border shrink-0">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold tracking-tight">NitiAI</div>
                <div className="text-[9px] text-sidebar-foreground/40 uppercase tracking-widest">Policy Intelligence</div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-sidebar-accent/60 text-sidebar-foreground/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 py-2 space-y-px px-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = location === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                      active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 bg-sidebar border-b border-sidebar-border text-sidebar-foreground flex items-center gap-3 px-4 h-14 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md hover:bg-sidebar-accent/60 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">N</span>
            </div>
            <span className="font-bold text-sm tracking-tight">NitiAI</span>
          </div>
          <span className="ml-auto text-xs text-sidebar-foreground/50 truncate">
            {navItems.find((n) => n.href === location)?.label ?? ""}
          </span>
        </header>

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
