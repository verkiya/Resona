// Primary app nav, org switcher, voice create entry, and billing usage footer.
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationSwitcher, UserButton, useClerk } from "@clerk/nextjs";
import {
  type LucideIcon,
  Home,
  LayoutGrid,
  AudioLines,
  Volume2,
  Settings,
  Headphones,
  BookIcon,
} from "lucide-react";
import Link from "next/link";
import { UsageContainer } from "@/features/billing/components/usage-container";
import { VoiceCreateDialog } from "@/features/voices/components/voice-create-dialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
  activeOverride?: boolean;
  external?: boolean;
  variant?: "default" | "cta";
}

interface NavSectionProps {
  label?: string;
  items: MenuItem[];
  pathname: string;
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!!item.url}
                isActive={
                  item.activeOverride ||
                  (item.url
                    ? item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                    : false)
                }
                onClick={item.onClick}
                tooltip={item.title}
                className={cn(
                  "h-10 cursor-pointer px-3 py-2 text-[13px] tracking-tight font-medium border border-transparent ",

                  item.variant === "cta"
                    ? [
                        "hover:bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))]",
                        "hover:text-white",
                        "hover:scale-[1.01]",
                        "active:scale-[0.99]",

                        "data-[active=true]:bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))]",
                        "data-[active=true]:text-white",
                        "data-[active=true]:font-semibold",
                        "data-[active=true]:shadow-lg",
                        "data-[active=true]:ring-2",
                        "data-[active=true]:ring-white/20",
                        "data-[active=true]:brightness-110",
                      ]
                    : [
                        "hover:bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))]",
                        "hover:text-white",
                        "hover:scale-[1.01]",
                        "active:scale-[0.99]",

                        "data-[active=true]:bg-primary/10",
                        "data-[active=true]:border-primary/20",
                        "data-[active=true]:text-foreground",
                        "data-[active=true]:font-semibold",
                        "data-[active=true]:shadow-sm",
                      ],
                )}
              >
                {item.url ? (
                  <Link
                    href={item.url}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const clerk = useClerk();
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    if (!settingsOpen) return;

    const observer = new MutationObserver(() => {
      const clerkModal =
        document.querySelector("[data-clerk-modal]") ||
        document.querySelector('[role="dialog"]');

      if (!clerkModal) {
        setSettingsOpen(false);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [settingsOpen]);
  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Explore voices", url: "/voices", icon: LayoutGrid },
    { title: "Text to speech", url: "/text-to-speech", icon: AudioLines },
    {
      title: "Voice cloning",
      icon: Volume2,
      onClick: () => setVoiceDialogOpen(true),

      activeOverride: voiceDialogOpen,
      variant: "cta",
    },
  ];

  const othersMenuItems: MenuItem[] = [
    {
      title: "What I learnt Building Resona",
      url: "/learnings",
      icon: BookIcon,
    },
    {
      title: "Organization Settings",
      icon: Settings,
      onClick: () => {
        setSettingsOpen(true);
        clerk.openOrganizationProfile();
      },
      activeOverride: settingsOpen,
      variant: "cta",
    },
    {
      title: "Help & Support",
      url: "mailto:hiverkiya@gmail.com",
      icon: Headphones,
      external: true,
    },
  ];

  return (
    <>
      <VoiceCreateDialog
        open={voiceDialogOpen}
        onOpenChange={setVoiceDialogOpen}
      />
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
            <Link href="/" className="flex flex-1 ">
              <Image
                src="/resona.svg"
                alt="Resona"
                width={40}
                height={40}
                className="rounded-sm"
              />
              <span className="mt-4 group-data-[collapsible=icon]:hidden font-semibold text-5xl tracking-tighter bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] bg-clip-text text-transparent">
                esona
              </span>
            </Link>
            <SidebarTrigger className="ml-auto  mr-2 size-8 cursor-pointer rounded-xl border border-transparent bg-card shadow-sm transition-all duration-100 ease-in-out  hover:scale-105 hover:bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] hover:text-white hover:shadow-lg active:scale-95 group-data-[collapsible=icon]:ml-0" />
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <OrganizationSwitcher
                hidePersonal
                fallback={
                  <Skeleton className="h-10 w-full rounded-xl border border-border/60 bg-card shadow-sm group-data-[collapsible=icon]:size-10" />
                }
                appearance={{
                  elements: {
                    rootBox:
                      "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",

                    organizationSwitcherTrigger:
                      "w-full! justify-between! rounded-xl! border! border-border/60! bg-card! px-2! py-2! gap-3! shadow-sm! transition-all! duration-200! hover:bg-muted! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1!",

                    organizationPreview: "gap-2!",
                    organizationPreviewAvatarBox: "size-7! rounded-md!",

                    organizationPreviewTextContainer:
                      "text-sm! font-medium! tracking-tight! text-foreground! group-data-[collapsible=icon]:hidden!",

                    organizationPreviewMainIdentifier: "text-sm!",

                    organizationSwitcherTriggerIcon:
                      "size-4! text-muted-foreground! group-data-[collapsible=icon]:hidden!",
                  },
                }}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <div className="px-3">
          <div className="h-px rounded-full bg-[linear-gradient(90deg,transparent,oklch(0.72_0.13_25),oklch(0.75_0.15_300),transparent)] shadow-[0_0_12px_oklch(0.75_0.15_300/.25)]" />
        </div>
        <SidebarContent>
          <NavSection
            label="Voice Studio"
            items={mainMenuItems}
            pathname={pathname}
          />
          <div className="px-3">
            <div className="h-px rounded-full bg-[linear-gradient(90deg,transparent,oklch(0.72_0.13_25),oklch(0.75_0.15_300),transparent)] shadow-[0_0_12px_oklch(0.75_0.15_300/.25)]" />
          </div>
          <NavSection
            label="Others"
            items={othersMenuItems}
            pathname={pathname}
          />
        </SidebarContent>
        <div className="px-3">
          <div className="h-px rounded-full bg-[linear-gradient(90deg,transparent,oklch(0.72_0.13_25),oklch(0.75_0.15_300),transparent)] shadow-[0_0_12px_oklch(0.75_0.15_300/.25)]" />
        </div>
        <SidebarFooter className="gap-3 py-3">
          <UsageContainer />
          <SidebarMenu>
            <SidebarMenuItem>
              <UserButton
                showName
                fallback={
                  <Skeleton className="h-10 w-full rounded-xl border border-border/60 bg-card shadow-sm group-data-[collapsible=icon]:size-10" />
                }
                appearance={{
                  elements: {
                    rootBox:
                      "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",

                    userButtonTrigger:
                      "w-full! justify-between! rounded-xl! border! border-border/60! bg-muted/30! px-2! py-2! shadow-sm! transition-all! duration-200! hover:bg-muted! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:after:hidden!",

                    userButtonBox: "flex-row-reverse! gap-2!",

                    userButtonOuterIdentifier:
                      "text-sm! font-medium! tracking-tight! text-foreground! pl-0! group-data-[collapsible=icon]:hidden!",

                    userButtonAvatarBox: "size-6!",
                  },
                }}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail  />
      </Sidebar>
    </>
  );
}
