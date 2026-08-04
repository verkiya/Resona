// Grid of QuickActionCard links on the dashboard home.
import { quickActions } from "@/features/dashboard/data/quick-actions";
import { QuickActionCard } from "./quick-action-card";

export function QuickActionsPanel() {
  return (
    <section className="space-y-6 rounded-2xl border border-border/50 bg-card/30 p-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Explore voice scenarios
        </h2>
        <p className="text-sm text-muted-foreground">
          Instantly test Resona with curated real-world voice prompts.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            gradient={action.gradient}
            href={action.href}
          />
        ))}
      </div>
    </section>
  );
}
