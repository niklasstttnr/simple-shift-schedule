import { useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";

// TODO: Use on generic solution to provide the page title, or implement breadcrumb navigation
const PATH_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Team",
  "/roles": "Roles",
  "/shifts": "Shifts",
  "/shifts/planning": "Planning",
  "/shifts/assignments": "Assignments",
};

function getPageTitle(pathname: string): string {
  return PATH_TITLES[pathname] ?? "Shift Schedule";
}

type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppLayout({ children, className }: AppLayoutProps) {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider
      className={className}
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-icon": "3rem",
          "--sidebar": "var(--primary)",
          "--sidebar-foreground": "var(--primary-foreground)",
          "--sidebar-accent":
            "color-mix(in srgb, var(--primary-foreground) 15%, transparent)",
          "--sidebar-accent-foreground": "var(--primary-foreground)",
          "--sidebar-border": "var(--primary-foreground) / 20%",
          "--sidebar-ring": "var(--primary-foreground) / 30%",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <span>
            <h1 className="truncate text-lg font-semibold text-foreground">
              {pageTitle}
            </h1>
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
