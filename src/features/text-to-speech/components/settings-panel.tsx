// Right rail combining generation settings and history on desktop.
import { History, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SettingsPanelHistory } from "./settings-panel-history";
import { SettingsPanelSettings } from "./settings-panel-settings";

const tabTriggerClassName =
  "cursor-pointer flex-1 h-full gap-2 rounded-none border-x-0 border-t-0 border-b border-b-transparent bg-transparent text-muted-foreground shadow-none transition-all duration-200 hover:bg-muted/30 hover:text-foreground data-[state=active]:border-b-[oklch(0.72_0.13_25)] data-[state=active]:bg-background/40 data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none";

export function SettingsPanel() {
  return (
    <div className="hidden w-105 min-h-0 flex-col border-l border-border/40 bg-card/60 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] lg:flex">
      <Tabs
        defaultValue="settings"
        className="flex h-full min-h-0 flex-col gap-y-0"
      >
        <TabsList className="h-12 w-full rounded-none border-b border-border/40 bg-background/60 p-0 backdrop-blur-md group-data-[orientation=horizontal]/tabs:h-12">
          <TabsTrigger value="settings" className={tabTriggerClassName}>
            <Settings className="size-5" />
            Settings
          </TabsTrigger>

          <TabsTrigger value="history" className={tabTriggerClassName}>
            <History className="size-5" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="settings"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-premium"
        >
          <SettingsPanelSettings />
        </TabsContent>

        <TabsContent
          value="history"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-premium"
        >
          <SettingsPanelHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
