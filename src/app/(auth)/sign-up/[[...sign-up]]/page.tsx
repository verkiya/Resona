// AI explanation: Clerk-hosted sign-up route.
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "elevated border rounded-2xl",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "border bg-card hover:bg-muted transition",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
          footerActionLink: "text-primary hover:opacity-80",
          formFieldInput: "bg-background border",
        },
      }}
    />
  );
}
