// AI explanation: Pass-through layout slot for the text-to-speech route segment.
import { TextToSpeechLayout } from "@/features/text-to-speech/views/text-to-speech-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TextToSpeechLayout>{children}</TextToSpeechLayout>;
}
