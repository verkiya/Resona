// AI explanation: Clerk-hosted sign-in route with custom premium Resona styling.

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "mx-auto w-full",

          card: `
            w-full border border-border/60
            rounded-3xl
            bg-card/80
            backdrop-blur-xl
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

          socialButtonsBlockButton: `
            h-11
            rounded-xl
            border border-border/60
            bg-background/70
            backdrop-blur-sm
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
            backdrop-blur-sm
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

          identityPreviewText: "text-foreground",

          identityPreviewEditButton: `
            text-primary
            hover:bg-primary/10
          `,

          formResendCodeLink: `
            text-primary
            hover:opacity-80
          `,

          otpCodeFieldInput: `
            h-12
            w-12
            rounded-xl
            border border-border/60
            bg-background/80
            shadow-sm
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
