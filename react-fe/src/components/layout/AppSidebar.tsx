"use client";

import { Calendar, CalendarCheck, LayoutDashboard, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: Calendar, label: "Shifts", href: "/shifts" },
  { icon: Users, label: "Team", href: "/users" },
] as const;

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-sidebar-border border-b">
        <a href="/">
          <div className="flex h-8 items-center gap-2 px-2">
            <CalendarCheck size={32} />
            <span className="truncate font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Shiftomatic
            </span>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ icon: Icon, label, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild tooltip={label}>
                  <a href={href}>
                    <Icon />
                    <span>{label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
