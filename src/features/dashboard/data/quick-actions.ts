// AI explanation: Static config for dashboard quick-action cards (labels, hrefs, icons).

export interface QuickAction {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  {
    title: "The Truthkeeper's Clock",
    description: "Narrate rich cinematic fiction with emotional pacing",
    gradient: "from-rose-300 via-stone-200 to-amber-100",
    href: "/text-to-speech?text=In a forgotten mountain village, an old clockmaker built clocks that never told the correct time, yet somehow always revealed the truth. One stormy evening, a traveler entered his workshop carrying a photograph of a woman who had vanished twenty years earlier. He placed it beside the ticking clocks and whispered, I need to know when she comes back.",
  },

  {
    title: "Launch a Luxury Brand",
    description: "Generate polished premium ad voiceovers that convert",
    gradient: "from-amber-300 via-orange-200 to-rose-100",
    href: "/text-to-speech?text=Introducing Aureline No. 7, a fragrance crafted for those who leave a lasting impression without saying a word. Notes of smoked vanilla, saffron, and midnight cedar unfold with every breath. This is not perfume. It is presence. Discover Aureline, where elegance becomes unforgettable.",
  },

  {
    title: "Interrogate the Suspect",
    description: "Create tense dialogue scenes with cinematic realism",
    gradient: "from-slate-400 via-zinc-300 to-stone-200",
    href: "/text-to-speech?text=Detective Rao leaned forward beneath the flickering interrogation room light. You said you were home at eleven. The taxi driver says midnight. Across the table, the suspect smiled faintly. Maybe your driver remembers the wrong face. Rao slid the photograph across the table. Then why were you standing beside the victim five minutes before he died?",
  },

  {
    title: "Summon the Final Boss",
    description: "Bring larger-than-life game characters to life",
    gradient: "from-fuchsia-300 via-violet-200 to-rose-100",
    href: "/text-to-speech?text=So, the last of the heroes finally arrives. I watched kingdoms burn while you trained with wooden swords and false hope. Kneel now, and I may grant your people a quicker end. Refuse, and I will carve your name into the ruins of this world as a warning to those who dream of defiance.",
  },

  {
    title: "Open a Viral Podcast",
    description: "Craft energetic intros designed to hook listeners fast",
    gradient: "from-cyan-300 via-sky-200 to-indigo-100",
    href: "/text-to-speech?text=Welcome back to Signal and Static, the show where we unpack the strange stories shaping technology, culture, and the future. Today, we're diving into the billion-dollar startup that nearly collapsed because of a single overlooked email. Trust me, this one gets wild fast.",
  },

  {
    title: "Guide Deep Calm",
    description: "Generate soothing meditation and mindfulness narration",
    gradient: "from-emerald-200 via-teal-100 to-cyan-50",
    href: "/text-to-speech?text=Take a slow breath in through your nose. Hold it gently. Now release. Let your shoulders soften. Let your jaw unclench. Imagine the noise of the day dissolving like mist at sunrise. For the next few moments, there is nothing to solve, nowhere to rush, and nothing required of you except this breath.",
  },
];
