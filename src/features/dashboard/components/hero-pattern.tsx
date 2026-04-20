import { WavyBackground } from "@/components/ui/wavy-background";

export function HeroPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      <WavyBackground
        colors={[
          "#fdba74", // soft orange
          "#fca5a5", // soft red
          "#f9a8d4", // soft pink
          "#d8b4fe", // soft purple
          "#fbcfe8", // pastel pink
        ]}
        backgroundFill="#f8fafc" // soft neutral (matches your light theme better than pure white)
        blur={4} // slightly more blur = smoother, less harsh
        speed="fast"
        waveOpacity={0.06} // softer, less distracting
        waveWidth={60}
        waveYOffset={250}
        containerClassName="h-full"
        className="hidden"
      />
    </div>
  );
}
