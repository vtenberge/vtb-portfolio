// Vincent ten Berge — portfolio Tweaks app
// Mounts the Tweaks panel on every page and applies styling to <html>.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "lime",
  "displayFont": "Instrument Serif",
  "bodyFont": "Manrope",
  "dark": true,
  "cursorBlob": true,
  "grain": true,
  "density": "regular",
  "marquee": true
}/*EDITMODE-END*/;

const ACCENTS = {
  lime:     { swatch: "#c8e23a", a: "oklch(0.88 0.21 130)", ink: "oklch(0.30 0.15 130)", a2: "oklch(0.72 0.20 25)" },
  coral:    { swatch: "#ff7a59", a: "oklch(0.75 0.20 25)",  ink: "oklch(0.30 0.13 25)",  a2: "oklch(0.86 0.20 130)" },
  electric: { swatch: "#5b9dff", a: "oklch(0.72 0.18 250)", ink: "oklch(0.30 0.10 250)", a2: "oklch(0.85 0.18 90)" },
  magenta:  { swatch: "#e85aa6", a: "oklch(0.70 0.22 340)", ink: "oklch(0.30 0.14 340)", a2: "oklch(0.84 0.18 130)" },
  butter:   { swatch: "#f4c95d", a: "oklch(0.85 0.15 85)",  ink: "oklch(0.32 0.10 85)",  a2: "oklch(0.70 0.18 25)" },
};

const DISPLAY_FONTS = {
  "Instrument Serif": '"Instrument Serif", "Iowan Old Style", Georgia, serif',
  "DM Serif Display": '"DM Serif Display", Georgia, serif',
  "Newsreader":       '"Newsreader", Georgia, serif',
  "Fraunces":         '"Fraunces", Georgia, serif',
};

const BODY_FONTS = {
  "Manrope":   '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "Geist":     '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
  "IBM Plex Sans": '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
};

const DENSITY = {
  cozy:    { section: "60px",   block: "32px",  pad: "24px" },
  regular: { section: "clamp(80px, 12vw, 160px)",  block: "clamp(40px, 6vw, 80px)",  pad: "clamp(20px, 4vw, 56px)" },
  airy:    { section: "clamp(120px, 16vw, 220px)", block: "clamp(60px, 8vw, 120px)", pad: "clamp(28px, 5vw, 72px)" },
};

function applyTweaks(t) {
  const root = document.documentElement;
  const accent = ACCENTS[t.accent] || ACCENTS.lime;
  root.style.setProperty("--accent", accent.a);
  root.style.setProperty("--accent-ink", t.dark ? accent.a : accent.ink);
  root.style.setProperty("--accent-2", accent.a2);

  const display = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS["Instrument Serif"];
  const body = BODY_FONTS[t.bodyFont] || BODY_FONTS["Manrope"];
  root.style.setProperty("--font-display", display);
  root.style.setProperty("--font-body", body);

  const d = DENSITY[t.density] || DENSITY.regular;
  root.style.setProperty("--gap-section", d.section);
  root.style.setProperty("--gap-block", d.block);
  root.style.setProperty("--page-pad", d.pad);

  // Dark is now default. data-theme="light" overrides.
  if (t.dark) root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", "light");

  if (t.cursorBlob) document.body.classList.remove("no-blob");
  else document.body.classList.add("no-blob");

  if (t.grain) document.body.classList.remove("no-grain");
  else document.body.classList.add("no-grain");

  document.body.classList.toggle("no-marquee", !t.marquee);
}

const LS_KEY = "vtb_tweaks";

function loadStored() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch (e) { return {}; }
}

function PortfolioTweaks() {
  const stored = loadStored();
  const [t, setTweakRaw] = useTweaks({ ...TWEAK_DEFAULTS, ...stored });

  // Wrap setTweak to also persist to localStorage for cross-page sync
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === "object" && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    const next = { ...loadStored(), ...edits };
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch (e) {}
    setTweakRaw(edits);
  }, [setTweakRaw]);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakColor
        label="Accent"
        value={ACCENTS[t.accent]?.swatch || "#c8e23a"}
        options={Object.values(ACCENTS).map(a => a.swatch)}
        onChange={(hex) => {
          const key = Object.keys(ACCENTS).find(k => ACCENTS[k].swatch === hex) || "lime";
          setTweak("accent", key);
        }}
      />
      <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      <TweakToggle label="Paper grain" value={t.grain} onChange={(v) => setTweak("grain", v)} />

      <TweakSection label="Type" />
      <TweakSelect
        label="Display font"
        value={t.displayFont}
        options={Object.keys(DISPLAY_FONTS)}
        onChange={(v) => setTweak("displayFont", v)}
      />
      <TweakSelect
        label="Body font"
        value={t.bodyFont}
        options={Object.keys(BODY_FONTS)}
        onChange={(v) => setTweak("bodyFont", v)}
      />

      <TweakSection label="Feel" />
      <TweakRadio
        label="Density"
        value={t.density}
        options={["cozy", "regular", "airy"]}
        onChange={(v) => setTweak("density", v)}
      />
      <TweakToggle label="Cursor blob" value={t.cursorBlob} onChange={(v) => setTweak("cursorBlob", v)} />
      <TweakToggle label="Hero marquee" value={t.marquee} onChange={(v) => setTweak("marquee", v)} />
    </TweaksPanel>
  );
}

// Mount on a root element if present
window.addEventListener("DOMContentLoaded", () => {
  // Apply tweaks immediately from localStorage so first paint is correct
  try {
    const stored = JSON.parse(localStorage.getItem("vtb_tweaks") || "{}");
    applyTweaks({ ...TWEAK_DEFAULTS, ...stored });
  } catch (e) { applyTweaks(TWEAK_DEFAULTS); }

  const root = document.getElementById("tweaks-root");
  if (root) {
    ReactDOM.createRoot(root).render(<PortfolioTweaks />);
  }
});
