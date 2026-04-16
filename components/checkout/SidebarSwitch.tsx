"use client";

import Sidebar, {
  SidebarV3Glass,
  SidebarV4Ticket,
  SidebarV7Clean,
  SidebarV8Collapsible,
  SidebarV9Clubbed,
  SidebarV10NoTimer,
  SidebarV11Simple,
  type SidebarProps,
} from "./Sidebar";

interface SidebarSwitchProps extends SidebarProps {
  variant?: string;
}

export default function SidebarSwitch({ variant = "v1", ...props }: SidebarSwitchProps) {
  switch (variant) {
    case "v3": return <SidebarV3Glass {...props} />;
    case "v4": return <SidebarV4Ticket {...props} />;
    case "v7": return <SidebarV7Clean {...props} />;
    case "v8": return <SidebarV8Collapsible {...props} />;
    case "v9": return <SidebarV9Clubbed {...props} />;
    case "v10": return <SidebarV10NoTimer {...props} />;
    case "v11": return <SidebarV11Simple {...props} />;
    default:  return <Sidebar {...props} />;
  }
}
