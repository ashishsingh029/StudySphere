"use client";

import {
  LucideIcon,
  Settings,
  Users,
  CheckCircle,
  LayoutDashboard,
  MessageCircleMore,
  Monitor,
  ChevronRight,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavMain() {
  const { hasPermission } = useAuthContext();

  const canManageSettings = hasPermission(
    Permissions.MANAGE_WORKSPACE_SETTINGS
  );

  const workspaceId = useWorkspaceId();
  const location = useLocation();

  const pathname = location.pathname;

    const { isMobile } = useSidebar();

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: `/workspace/${workspaceId}/tasks`,
      icon: CheckCircle,
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
    },

    ...(canManageSettings
      ? [
        {
          title: "Settings",
          url: `/workspace/${workspaceId}/settings`,
          icon: Settings,
        },
      ]
      : []),
    {
      title: "Chat",
      url: `/workspace/${workspaceId}/chat`,
      icon: MessageCircleMore,
    },
    {
      title: "Whiteboard",
      url: `/workspace/${workspaceId}/whiteboard`,
      icon: Monitor,
    }
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          item.title !== "Whiteboard" ? (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={item.url === pathname} asChild>
                <Link to={item.url} className="!text-[15px]">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key="Whiteboard">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton isActive={pathname.includes(item.url)}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>Whiteboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start" className="w-[--radix-dropdown-menu-trigger-width] text-base">
                  <DropdownMenuItem asChild>
                    <Link to={`${item.url}/create`}>
                      Create Room
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`${item.url}/join`}>
                      Join Room
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>

  );
}
