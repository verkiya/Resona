// Voices segment layout: wraps routes with VoicesLayout.
import { VoicesLayout } from "@/features/voices/views/voices-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <VoicesLayout>{children}</VoicesLayout>;
}
