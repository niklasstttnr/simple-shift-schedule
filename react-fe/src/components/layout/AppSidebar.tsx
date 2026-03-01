import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  CalendarCheck,
  CalendarRange,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  {
    icon: Calendar,
    label: "Shifts",
    to: "/shifts",
    sub: [{ label: "Planning", to: "/shifts/planning", icon: CalendarRange }],
  },
  { icon: Users, label: "Team", to: "/users" },
  { icon: Shield, label: "Roles", to: "/roles" },
] as const;

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-sidebar-border border-b">
        <Link to="/">
          <div className="flex h-8 items-center gap-2 px-2">
            <CalendarCheck size={32} />
            <span className="truncate font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Shiftomatic
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const hasSub = "sub" in item && item.sub.length > 0;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {hasSub && (
                    <SidebarMenuSub>
                      {item.sub!.map((sub) => (
                        <SidebarMenuSubItem key={sub.to}>
                          <SidebarMenuSubButton asChild isActive={location.pathname === sub.to}>
                            <NavLink to={sub.to}>
                              {sub.icon && <sub.icon className="size-4" />}
                              <span>{sub.label}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
