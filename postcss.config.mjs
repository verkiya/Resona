// PostCSS config for Next's CSS pipeline.
// Loads Tailwind v4's PostCSS plugin so globals.css and shadcn styles compile
// into the application stylesheet.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
