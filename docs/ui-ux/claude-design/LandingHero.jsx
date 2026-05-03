/* global React */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headlineSize": 56,
  "density": "relaxed",
  "accent": "coral",
  "trustLayout": "cards",
  "background": "cream",
  "ctaStyle": "filled",
  "showTrustNumbers": false,
  "showSidePanel": true,
  "iconStyle": "stroke"
}/*EDITMODE-END*/;

// ---------- Icons (stroke style, 24px, sage) ----------
function HourglassIcon({ size = 28, color = "#5B8C6C", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4 H23" />
      <path d="M9 28 H23" />
      <path d="M9 4 V9 C9 13 16 14 16 16 C16 18 9 19 9 23 V28" />
      <path d="M23 4 V9 C23 13 16 14 16 16 C16 18 23 19 23 23 V28" />
      {filled && <path d="M11 6 H21 L18 11 C17 12 15 12 14 11 Z" fill={color} stroke="none" opacity="0.6" />}
    </svg>
  );
}

function DocCheckIcon({ size = 28, color = "#5B8C6C", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 4 H19 L24 9 V27 C24 27.5 23.5 28 23 28 H9 C8.5 28 8 27.5 8 27 Z" fill={filled ? "#E8F1EB" : "none"} />
      <path d="M19 4 V9 H24" />
      <path d="M12 17 L15 20 L20 14" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function ClipboardIcon({ size = 28, color = "#5B8C6C", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="6" width="18" height="22" rx="1.5" fill={filled ? "#E8F1EB" : "none"} />
      <rect x="11" y="3" width="10" height="5" rx="1" fill="#F5F2ED" />
      <path d="M11.5 14 H20.5" />
      <path d="M11.5 18 H20.5" />
      <path d="M11.5 22 H17" />
    </svg>
  );
}

const TRUST_ICONS = {
  hourglass: HourglassIcon,
  doc: DocCheckIcon,
  clipboard: ClipboardIcon,
};

// ---------- Trust card ----------
function TrustCard({ iconKey, label, subtext, number, layout, accent, iconStyle }) {
  const Icon = TRUST_ICONS[iconKey];
  const filled = iconStyle === "filled";

  if (layout === "list") {
    return (
      <div className="lh-trust-row">
        <div className="lh-trust-row-icon"><Icon size={24} filled={filled} /></div>
        <div>
          <div className="lh-trust-label">{label}</div>
          <div className="lh-trust-sub">{subtext}</div>
        </div>
      </div>
    );
  }

  if (layout === "inline") {
    return (
      <div className="lh-trust-inline">
        <Icon size={20} filled={filled} />
        <span className="lh-trust-inline-label">{label}</span>
      </div>
    );
  }

  // cards (default)
  return (
    <div className="lh-trust-card">
      <div className="lh-trust-card-head">
        <div className="lh-trust-card-icon">
          <Icon size={28} filled={filled} />
        </div>
        {number && <div className="lh-trust-card-num">{number}</div>}
      </div>
      <div className="lh-trust-label">{label}</div>
      <div className="lh-trust-sub">{subtext}</div>
    </div>
  );
}

// ---------- Side panel: a soft, on-brand visual (no stock photo) ----------
// A simple visual showing structured progress — communicates "structured assessment"
function SidePanel({ accent }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const accentHex = accent === "blue" ? "#6B9BC5" : "#D4876A";

  return (
    <div className={`lh-side ${revealed ? "is-revealed" : ""}`} aria-hidden="true">
      <div className="lh-side-card">
        <div className="lh-side-meta">
          <span className="lh-side-meta-label">SESSION</span>
          <span className="lh-side-meta-val">ADHD-PREP-2026</span>
        </div>

        <div className="lh-side-section">
          <div className="lh-side-section-title">Assessment progress</div>
          <div className="lh-side-progress">
            <div className="lh-side-progress-fill" style={{ width: "62%" }} />
          </div>
          <div className="lh-side-progress-meta">
            <span>Section 3 of 5</span>
            <span>~17 min remaining</span>
          </div>
        </div>

        <div className="lh-side-list">
          <div className="lh-side-step is-done">
            <div className="lh-side-step-dot"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L4 7 L8 3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <div>
              <div className="lh-side-step-label">ASRS screening</div>
              <div className="lh-side-step-sub">18 questions · complete</div>
            </div>
          </div>
          <div className="lh-side-step is-done">
            <div className="lh-side-step-dot"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L4 7 L8 3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <div>
              <div className="lh-side-step-label">Childhood history</div>
              <div className="lh-side-step-sub">Ages 5–12 · complete</div>
            </div>
          </div>
          <div className="lh-side-step is-active">
            <div className="lh-side-step-dot lh-side-step-dot--active" />
            <div>
              <div className="lh-side-step-label">AI-guided interview</div>
              <div className="lh-side-step-sub">Question 7 of 12 · in progress</div>
            </div>
          </div>
          <div className="lh-side-step">
            <div className="lh-side-step-dot lh-side-step-dot--idle" />
            <div>
              <div className="lh-side-step-label">Family observations</div>
              <div className="lh-side-step-sub">Optional · skippable</div>
            </div>
          </div>
          <div className="lh-side-step">
            <div className="lh-side-step-dot lh-side-step-dot--idle" />
            <div>
              <div className="lh-side-step-label">Clinician-ready report</div>
              <div className="lh-side-step-sub">Generated automatically</div>
            </div>
          </div>
        </div>

        <div className="lh-side-foot">
          <div className="lh-side-foot-left">
            <div className="lh-side-foot-label">PAUSE-RESUME</div>
            <div className="lh-side-foot-val">Auto-saved · 12:04</div>
          </div>
          <div className="lh-side-foot-pill" style={{ background: "#E8F1EB", color: "#3D5E4D" }}>
            <span className="lh-side-foot-dot" />
            Encrypted
          </div>
        </div>
      </div>

      {/* small floating note tied to sage */}
      <div className="lh-side-note">
        <div className="lh-side-note-icon" style={{ background: accentHex + "1F", color: accentHex }}>
          i
        </div>
        <div>
          <div className="lh-side-note-title">You can pause anytime</div>
          <div className="lh-side-note-sub">Your responses save as you go.</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Hero ----------
function LandingHero() {
  const hookResult = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];
  const t = hookResult[0] || TWEAK_DEFAULTS;
  const setTweak = hookResult[1] || (() => {});

  // Reveal motion (opacity only, respects reduced-motion via CSS)
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 80);
    const t2 = setTimeout(() => setStage(2), 220);
    const t3 = setTimeout(() => setStage(3), 360);
    const t4 = setTimeout(() => setStage(4), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const accentHex = t.accent === "blue" ? "#6B9BC5" : "#D4876A";
  const accentHexDark = t.accent === "blue" ? "#456E8F" : "#B86A4F";

  const trustCards = [
    { iconKey: "hourglass", label: "45-Minute Assessment", subtext: "Quick, structured, comprehensive", number: "01" },
    { iconKey: "doc", label: "Not a Diagnosis", subtext: "Preparation only. Clinician confirms.", number: "02" },
    { iconKey: "clipboard", label: "Clinician-Ready Report", subtext: "Export as PDF, share with provider", number: "03" },
  ];

  const bgClass = `lh-bg-${t.background}`;
  const densityClass = `lh-density-${t.density}`;

  return (
    <div className={`lh-root ${bgClass} ${densityClass}`} style={{ "--lh-accent": accentHex, "--lh-accent-dark": accentHexDark }}>
      {/* Top bar: minimal, per design system */}
      <header className={`lh-nav ${stage >= 1 ? "is-in" : ""}`}>
        <div className="lh-nav-inner">
          <div className="lh-brand">
            <div className="lh-brand-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="#5B8C6C" strokeWidth="1.5" />
                <path d="M6 11 L9.5 14.5 L16 8" stroke="#5B8C6C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="lh-brand-name">ADHD-Prep</div>
          </div>
          <nav className="lh-nav-links">
            <a href="#how">How it works</a>
            <a href="#science">The science</a>
            <a href="#privacy">Privacy</a>
            <a href="#login" className="lh-nav-login">Sign in</a>
          </nav>
        </div>
      </header>

      <main className="lh-main">
        <div className="lh-grid">
          {/* LEFT — copy + CTAs + trust cards */}
          <section className="lh-col lh-col-copy">
            <div className={`lh-eyebrow ${stage >= 1 ? "is-in" : ""}`}>
              <span className="lh-eyebrow-dot" />
              <span className="lh-eyebrow-text">For adults considering an ADHD evaluation</span>
            </div>

            <h1 className={`lh-headline ${stage >= 2 ? "is-in" : ""}`} style={{ fontSize: t.headlineSize + "px" }}>
              Prepare for your <span className="lh-headline-em">ADHD evaluation</span>
            </h1>

            <p className={`lh-sub ${stage >= 2 ? "is-in" : ""}`}>
              Structured AI-guided assessment. Clinician-ready report.
              <br />
              <span className="lh-sub-soft">Not a diagnosis. Takes 45 minutes.</span>
            </p>

            <div className={`lh-ctas ${stage >= 3 ? "is-in" : ""}`}>
              <button
                className={`lh-btn lh-btn-primary lh-btn-${t.ctaStyle}`}
                onClick={() => {}}
              >
                <span>Start $49 Assessment</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 9 H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M10 6 L13 9 L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="lh-btn lh-btn-secondary">
                Learn more
              </button>
            </div>

            <div className={`lh-microtrust ${stage >= 3 ? "is-in" : ""}`}>
              <span className="lh-microtrust-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="2.5" y="6" width="9" height="6.5" rx="1" stroke="#6B7280" strokeWidth="1.2" />
                  <path d="M4.5 6 V4.5 A2.5 2.5 0 0 1 9.5 4.5 V6" stroke="#6B7280" strokeWidth="1.2" />
                </svg>
                HIPAA-aligned · encrypted
              </span>
              <span className="lh-microtrust-sep">·</span>
              <span className="lh-microtrust-item">Pause and resume anytime</span>
              <span className="lh-microtrust-sep">·</span>
              <span className="lh-microtrust-item">Refund within 7 days</span>
            </div>

            {/* Trust signal cards */}
            <div className={`lh-trust lh-trust-${t.trustLayout} ${stage >= 4 ? "is-in" : ""}`}>
              {trustCards.map((c, i) => (
                <TrustCard
                  key={c.iconKey}
                  iconKey={c.iconKey}
                  label={c.label}
                  subtext={c.subtext}
                  number={t.showTrustNumbers ? c.number : null}
                  layout={t.trustLayout}
                  accent={t.accent}
                  iconStyle={t.iconStyle}
                />
              ))}
            </div>

            <div className={`lh-disclaimer ${stage >= 4 ? "is-in" : ""}`}>
              <strong>Important:</strong> ADHD-Prep does not provide a diagnosis. This is preparation for a conversation with a licensed clinician, who confirms any diagnosis.
            </div>
          </section>

          {/* RIGHT — soft on-brand product visual */}
          {t.showSidePanel && (
            <aside className={`lh-col lh-col-side ${stage >= 3 ? "is-in" : ""}`}>
              <SidePanel accent={t.accent} />
            </aside>
          )}
        </div>
      </main>

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Layout">
            <window.TweakRadio
              label="Density"
              value={t.density}
              options={[{ value: "relaxed", label: "Relaxed" }, { value: "compact", label: "Compact" }]}
              onChange={(v) => setTweak("density", v)}
            />
            <window.TweakRadio
              label="Trust signals"
              value={t.trustLayout}
              options={[
                { value: "cards", label: "Cards" },
                { value: "list", label: "List" },
                { value: "inline", label: "Inline" },
              ]}
              onChange={(v) => setTweak("trustLayout", v)}
            />
            <window.TweakToggle
              label="Show side panel"
              value={t.showSidePanel}
              onChange={(v) => setTweak("showSidePanel", v)}
            />
            <window.TweakToggle
              label="Number trust cards"
              value={t.showTrustNumbers}
              onChange={(v) => setTweak("showTrustNumbers", v)}
            />
          </window.TweakSection>

          <window.TweakSection label="Style">
            <window.TweakRadio
              label="Background"
              value={t.background}
              options={[
                { value: "cream", label: "Cream" },
                { value: "white", label: "White" },
                { value: "wash", label: "Wash" },
              ]}
              onChange={(v) => setTweak("background", v)}
            />
            <window.TweakRadio
              label="Accent"
              value={t.accent}
              options={[
                { value: "coral", label: "Coral" },
                { value: "blue", label: "Soft Blue" },
              ]}
              onChange={(v) => setTweak("accent", v)}
            />
            <window.TweakRadio
              label="Primary CTA"
              value={t.ctaStyle}
              options={[
                { value: "filled", label: "Filled" },
                { value: "outline", label: "Outline" },
              ]}
              onChange={(v) => setTweak("ctaStyle", v)}
            />
            <window.TweakRadio
              label="Trust icons"
              value={t.iconStyle}
              options={[
                { value: "stroke", label: "Stroke" },
                { value: "filled", label: "Tinted" },
              ]}
              onChange={(v) => setTweak("iconStyle", v)}
            />
          </window.TweakSection>

          <window.TweakSection label="Type">
            <window.TweakSlider
              label="Headline size"
              value={t.headlineSize}
              min={36} max={72} step={2}
              onChange={(v) => setTweak("headlineSize", v)}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

window.LandingHero = LandingHero;
