// Org selection route: forces users to choose/create an org before entering org-scoped routes.

import { OrganizationList } from "@clerk/nextjs";

export default function OrgSelectionPage() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      appearance={{
        elements: {
          rootBox: "mx-auto w-full",

          card: `
            w-full border border-border/60
            rounded-3xl
            bg-card/80
            shadow-2xl
            px-8 py-8
          `,

          headerTitle: `
            text-foreground
            text-2xl
            font-semibold
            tracking-tight
          `,

          headerSubtitle: `
            text-muted-foreground
            text-sm
            mt-1
          `,

          organizationSwitcherTrigger: `
            rounded-xl
            border border-border/60
            bg-background/80
            shadow-sm
            transition-all duration-200
            hover:bg-primary/8
            hover:border-primary/20
          `,

          organizationPreview: `
            rounded-xl
            transition-all duration-200
            hover:bg-primary/6
          `,

          organizationPreviewTextContainer: `
            text-foreground
          `,

          organizationPreviewMainIdentifier: `
            text-sm
            font-medium
            text-foreground
          `,

          organizationPreviewSecondaryIdentifier: `
            text-xs
            text-muted-foreground
          `,

          organizationListCreateOrganizationActionButton: `
            h-11
            rounded-xl
            border border-dashed border-primary/30
            bg-primary/6
            text-primary
            font-medium
            transition-all duration-200
            hover:bg-primary/10
            hover:border-primary/40
          `,

          socialButtonsBlockButton: `
            h-11
            rounded-xl
            border border-border/60
            bg-background/70
            shadow-sm
            transition-all duration-200
            hover:bg-primary/8
            hover:border-primary/20
            hover:shadow-md
          `,

          socialButtonsBlockButtonText: `
            text-sm
            font-medium
            text-foreground
          `,

          dividerLine: "bg-border/60",

          dividerText: `
            text-xs
            uppercase
            tracking-[0.16em]
            text-muted-foreground
          `,

          formFieldLabel: `
            text-sm
            font-medium
            text-foreground
          `,

          formFieldInput: `
            h-11
            rounded-xl
            border border-border/60
            bg-background/80
            shadow-sm
            transition-all duration-200
            focus:border-primary/40
            focus:ring-2
            focus:ring-primary/15
          `,

          formButtonPrimary: `
            h-11
            rounded-xl
            border-0
            bg-primary
            text-primary-foreground
            font-medium
            shadow-lg
            transition-all duration-200
            hover:scale-[1.01]
            hover:opacity-95
            hover:shadow-xl
            active:scale-[0.99]
          `,

          footerActionText: `
            text-muted-foreground
          `,

          footerActionLink: `
            text-primary
            font-medium
            transition-opacity
            hover:opacity-80
          `,

          alertText: "text-sm",

          formFieldErrorText: `
            text-destructive
            text-xs
            font-medium
          `,
        },
      }}
    />
  );
}
