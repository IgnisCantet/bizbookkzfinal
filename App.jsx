/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  BizBook KZ v4.0 — Финальная платформа                     ║
 * ║  © 2026 ТОО «NOVA Comp». Все права защищены.               ║
 * ║  Закон РК «Об авторском праве» №6-I                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MRP, MZP, APP, PALETTE, CO, EMPLOYEES, DOCS_DATA, BANK_OPS,
  COUNTERPARTIES, TAXES_DATA, TAX_CALENDAR, NEWS_DATA,
  DOC_COLORS, DOC_ICONS, calcSalary, T
} from "./data/constants.js";

// ─── THEME ────────────────────────────────────────────────────────
const DARK = {
  bg: "#0d0d1a", card: "#13131f", card2: "#1a1a2e", card3: "#21213a",
  border: "rgba(124,111,255,0.14)", border2: "rgba(124,111,255,0.3)",
  text: "#f0efff", muted: "#6b6b8a", dim: "#252540",
  primary: "#7c6fff", primary2: "#6152e0",
  gold: "#f59e0b", goldL: "#fbbf24",
  green: "#22c55e", red: "#ef4444", cyan: "#06b6d4", pink: "#ec4899",
  navBg: "#0d0d1a", inputBg: "#1a1a2e",
  pSoft: "rgba(124,111,255,0.14)", gSoft: "rgba(245,158,11,0.13)",
};
const LIGHT = {
  bg: "#f5f4ff", card: "#ffffff", card2: "#eeecff", card3: "#e4e1ff",
  border: "rgba(124,111,255,0.15)", border2: "rgba(124,111,255,0.3)",
  text: "#0d0d1a", muted: "#6b6b8a", dim: "#c4c0e8",
  primary: "#7c6fff", primary2: "#6152e0",
  gold: "#d97706", goldL: "#f59e0b",
  green: "#15803d", red: "#b91c1c", cyan: "#0e7490", pink: "#db2777",
  navBg: "#ffffff", inputBg: "#f0eeff",
  pSoft: "rgba(124,111,255,0.1)", gSoft: "rgba(217,119,6,0.1)",
};

function useTheme() {
  const sys = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const [mode, setMode] = useState(() => { try { return localStorage.getItem("bb_theme") || "system"; } catch { return "system"; } });
  const resolved = mode === "system" ? sys() : mode;
  const C = resolved === "dark" ? DARK : LIGHT;
  useEffect(() => {
    try { localStorage.setItem("bb_theme", mode); } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => { if (mode === "system") setMode(m => m); };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [mode]);
  return { C, mode, setMode, resolved };
}

function useLang() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("bb_lang") || "ru"; } catch { return "ru"; } });
  useEffect(() => { try { localStorage.setItem("bb_lang", lang); } catch {} }, [lang]);
  const t = useCallback(k => T[lang]?.[k] || T.ru[k] || k, [lang]);
  return { lang, setLang, t };
}

function useVw() {
  const [vw, setVw] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setVw(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return vw;
}

// ─── UTILS ────────────────────────────────────────────────────────
const fmt  = n => (n || 0).toLocaleString("ru-KZ") + " ₸";
const fmtS = n => n >= 1e6 ? (n/1e6).toFixed(1) + " млн" : n >= 1e3 ? Math.round(n/1e3) + "К" : String(n);
const PAY_MAP = {
  paid:    { ru:"Оплачен",    kz:"Төленді",   c:"#22c55e", b:"rgba(34,197,94,.13)"  },
  partial: { ru:"Частично",   kz:"Ішінара",   c:"#f59e0b", b:"rgba(245,158,11,.13)" },
  unpaid:  { ru:"Не оплачен", kz:"Төленбеді", c:"#ef4444", b:"rgba(239,68,68,.13)"  },
};

// ─── BRIEFCASE LOGO (original style) ──────────────────────────────
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7c6fff"/>
        <stop offset="100%" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#lbg)"/>
    {/* Handle left */}
    <rect x="33" y="18" width="9" height="20" rx="4.5" fill="white"/>
    {/* Handle right */}
    <rect x="58" y="18" width="9" height="20" rx="4.5" fill="white"/>
    {/* Handle top bar */}
    <rect x="33" y="18" width="34" height="9" rx="4.5" fill="white"/>
    {/* Body */}
    <rect x="12" y="35" width="76" height="48" rx="10" fill="white"/>
    {/* Gold stripe */}
    <rect x="12" y="53" width="76" height="11" rx="0" fill="#f59e0b"/>
    {/* Lock body */}
    <rect x="40" y="48" width="20" height="22" rx="7" fill="#4f46e5"/>
    {/* Lock hole */}
    <circle cx="50" cy="57" r="3.5" fill="#f59e0b"/>
    <rect x="48" y="57" width="4" height="7" rx="2" fill="#f59e0b"/>
  </svg>
);

// ─── UI ATOMS ─────────────────────────────────────────────────────
const Badge = ({ s, map, lang = "ru" }) => {
  const d = map[s] || Object.values(map)[0];
  return <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 12, fontWeight: 700, background: d.b, color: d.c, whiteSpace: "nowrap" }}>{lang === "kz" && d.kz ? d.kz : d.ru}</span>;
};

const DIcon = ({ type, sz = 34 }) => (
  <div style={{ width: sz, height: sz, borderRadius: sz * .28, flexShrink: 0, background: `${DOC_COLORS[type] || "#7c6fff"}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * .44 }}>
    {DOC_ICONS[type] || "📄"}
  </div>
);

const Btn = ({ children, onClick, col, style = {}, disabled }) => {
  const bg = disabled ? "#2a2a40" : `linear-gradient(135deg,${col||"#7c6fff"},${col?col+"bb":"#6152e0"})`;
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "12px 0", borderRadius: 14, background: bg, border: "none", color: disabled ? "#6b6b8a" : "#fff", fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", width: "100%", ...style }}>
      {children}
    </button>
  );
};

const SBtn = ({ children, onClick, C, style = {} }) => (
  <button onClick={onClick} style={{ padding: "11px 0", borderRadius: 13, background: C.card2, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", ...style }}>
    {children}
  </button>
);

const Input = ({ label, value, onChange, placeholder, type = "text", C }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: .6 }}>{label}</p>}
    <input value={value || ""} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border2}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
  </div>
);

const Fd = ({ label, value, C }) => (
  <div style={{ marginBottom: 10 }}>
    <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
    <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 14px", color: value ? C.text : C.dim, fontSize: 12 }}>{value || "—"}</div>
  </div>
);

const Sec = ({ children, action, onAction, C }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 8px" }}>
    <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 1.2 }}>{children}</p>
    {action && <button onClick={onAction} style={{ background: "none", border: "none", color: C.primary, fontSize: 11, cursor: "pointer", fontWeight: 600, padding: 0 }}>{action}</button>}
  </div>
);

const Toggle = ({ on, onToggle, col }) => (
  <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? (col || "#7c6fff") : "#374151", display: "flex", alignItems: "center", padding: "0 3px", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
    <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", transform: on ? "translateX(20px)" : "translateX(0)", transition: "transform .2s" }} />
  </div>
);

// ─── SIDE MENU ────────────────────────────────────────────────────
function SideMenu({ open, onClose, screen, nav, C, t, mode, setMode, lang, setLang }) {
  const items = [
    ["home", "🏠", t("home")], ["docs", "📁", t("docs")], ["bank", "🏦", t("bank")],
    ["taxes", "📊", t("taxes")], ["analytics", "📈", t("analytics")],
    ["calendar", "📅", t("calendar")], ["news", "📰", t("news")],
    ["ai", "🤖", t("ai")], ["profile", "👤", t("profile")],
  ];
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 100, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity .22s" }} />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 275, background: C.card, borderRight: `1px solid ${C.border2}`, zIndex: 101, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .26s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={36} />
          <div>
            <p style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: 0 }}>{APP.name}</p>
            <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{APP.owner}</p>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
        </div>
        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
          {items.map(([key, icon, label]) => {
            const active = screen === key;
            return (
              <button key={key} onClick={() => { nav(key); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12, border: "none", cursor: "pointer", background: active ? C.pSoft : "transparent", marginBottom: 3, textAlign: "left" }}>
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
                <span style={{ color: active ? C.primary : C.text, fontSize: 13, fontWeight: active ? 700 : 400 }}>{label}</span>
                {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: 3, background: C.primary }} />}
              </button>
            );
          })}
        </div>
        {/* Theme */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: "0 0 7px", textTransform: "uppercase", letterSpacing: 1 }}>{t("dark")} / {t("light")} / {t("system")}</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {[["dark", "🌙"], ["light", "☀️"], ["system", "💻"]].map(([v, ic]) => (
              <button key={v} onClick={() => setMode(v)} style={{ flex: 1, padding: "7px 3px", borderRadius: 10, border: `1.5px solid ${mode === v ? C.primary : C.border}`, background: mode === v ? C.pSoft : "transparent", color: mode === v ? C.primary : C.muted, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{ic}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[["ru", "🇷🇺 РУС"], ["kz", "🇰🇿 ҚАЗ"]].map(([v, l]) => (
              <button key={v} onClick={() => setLang(v)} style={{ flex: 1, padding: "7px", borderRadius: 10, border: `1.5px solid ${lang === v ? C.primary : C.border}`, background: lang === v ? C.pSoft : "transparent", color: lang === v ? C.text : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "8px 14px 16px", borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.dim, fontSize: 7, margin: 0, textAlign: "center", lineHeight: 1.6 }}>{t("copyright")}<br />Закон РК «Об авторском праве» №6-I</p>
        </div>
      </div>
    </>
  );
}

// ─── DESKTOP SIDEBAR ──────────────────────────────────────────────
function DesktopSidebar({ screen, nav, C, t, mode, setMode, lang, setLang }) {
  const items = [
    ["home", "🏠", t("home")], ["docs", "📁", t("docs")], ["bank", "🏦", t("bank")],
    ["taxes", "📊", t("taxes")], ["analytics", "📈", t("analytics")],
    ["calendar", "📅", t("calendar")], ["news", "📰", t("news")],
    ["ai", "🤖", t("ai")], ["profile", "👤", t("profile")],
  ];
  return (
    <div style={{ width: 230, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "18px 16px 13px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={34} />
        <div>
          <p style={{ color: C.text, fontSize: 14, fontWeight: 800, margin: 0 }}>{APP.name}</p>
          <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{APP.owner}</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {items.map(([key, icon, label]) => {
          const active = screen === key;
          return (
            <button key={key} onClick={() => nav(key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 11px", borderRadius: 11, border: "none", cursor: "pointer", background: active ? C.pSoft : "transparent", marginBottom: 2, textAlign: "left" }}>
              <span style={{ fontSize: 17, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
              <span style={{ color: active ? C.primary : C.text, fontSize: 12, fontWeight: active ? 700 : 400 }}>{label}</span>
              {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: 3, background: C.primary, flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 7 }}>
          {[["dark", "🌙"], ["light", "☀️"], ["system", "💻"]].map(([v, ic]) => (
            <button key={v} onClick={() => setMode(v)} style={{ flex: 1, padding: "6px 2px", borderRadius: 8, border: `1.5px solid ${mode === v ? C.primary : C.border}`, background: mode === v ? C.pSoft : "transparent", color: mode === v ? C.primary : C.muted, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{ic}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["ru", "🇷🇺 РУС"], ["kz", "🇰🇿 ҚАЗ"]].map(([v, l]) => (
            <button key={v} onClick={() => setLang(v)} style={{ flex: 1, padding: "6px", borderRadius: 8, border: `1.5px solid ${lang === v ? C.primary : C.border}`, background: lang === v ? C.pSoft : "transparent", color: lang === v ? C.text : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "6px 12px 14px", borderTop: `1px solid ${C.border}` }}>
        <p style={{ color: C.dim, fontSize: 7, margin: 0, textAlign: "center", lineHeight: 1.6 }}>{t("copyright")}</p>
      </div>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────
function SplashScreen({ nav, C, t, lang }) {
  const [tab, setTab] = useState("login");
  const [agreed, setAgreed] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [phone, setPhone] = useState("+7 705 474 1612");
  const [pass, setPass] = useState("");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 30% 20%, rgba(124,111,255,.22), ${C.bg} 65%)` }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px" }}>
        <div style={{ marginBottom: 16, padding: 14, background: C.pSoft, borderRadius: 24, border: `1px solid ${C.border2}` }}>
          <Logo size={62} />
        </div>
        <h1 style={{ color: C.text, fontSize: 27, fontWeight: 900, margin: "0 0 5px", letterSpacing: -0.5 }}>{APP.name}</h1>
        <p style={{ color: C.muted, fontSize: 12, margin: "0 0 6px" }}>{lang === "kz" ? "Бизнес үшін ақылды бухгалтерия" : "Умная бухгалтерия для бизнеса РК"} · 2026</p>
        <p style={{ color: C.dim, fontSize: 9 }}>{APP.owner}</p>
      </div>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "22px 22px 32px", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.card2, borderRadius: 12, padding: "3px" }}>
          {["login", "register"].map(tb => (
            <button key={tb} onClick={() => setTab(tb)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: tab === tb ? C.primary : "transparent", color: tab === tb ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {tb === "login" ? t("login") : t("register")}
            </button>
          ))}
        </div>
        {tab === "login" ? (
          <>
            <Input label="Телефон / Email / БИН" value={phone} onChange={setPhone} C={C} />
            <Input label={t("settings") ? "Пароль" : "Пароль"} value={pass} onChange={setPass} type="password" placeholder="••••••••" C={C} />
            <div style={{ textAlign: "right", marginBottom: 12 }}><span style={{ color: C.primary, fontSize: 11, cursor: "pointer" }}>Забыли пароль?</span></div>
            <Btn onClick={() => nav("home")} col={C.primary}>{lang === "kz" ? "Аккаунтқа кіру" : "Войти в аккаунт"}</Btn>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <SBtn onClick={() => nav("home")} C={C} style={{ flex: 1, fontSize: 10 }}>📱 eGov Mobile</SBtn>
              <SBtn onClick={() => nav("home")} C={C} style={{ flex: 1, fontSize: 10 }}>☁️ eGov Cloud</SBtn>
            </div>
          </>
        ) : (
          <>
            <Input label="БИН / ИИН" value="" onChange={() => {}} placeholder="241040014477" C={C} />
            <Input label="Телефон" value="" onChange={() => {}} placeholder="+7 700 000 00 00" C={C} />
            <Input label="Пароль" value="" onChange={() => {}} type="password" C={C} />
            <div onClick={() => setAgreed(!agreed)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${agreed ? C.primary : C.border}`, background: agreed ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {agreed && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
              </div>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>
                Принимаю{" "}
                <span onClick={e => { e.stopPropagation(); setShowOffer(true); }} style={{ color: C.primary, textDecoration: "underline", cursor: "pointer" }}>Договор публичной оферты</span>
              </p>
            </div>
            <Btn onClick={() => agreed && nav("onboard")} col={agreed ? C.primary : undefined} disabled={!agreed}>
              {lang === "kz" ? "Аккаунт жасау →" : "Создать аккаунт →"}
            </Btn>
          </>
        )}
      </div>
      {showOffer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", padding: "18px 18px 26px" }}>
            <div style={{ width: 36, height: 4, background: C.dim, borderRadius: 2, margin: "0 auto 14px" }} />
            <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>📑 Договор публичной оферты</h3>
            <p style={{ color: C.muted, fontSize: 10, margin: "0 0 12px" }}>{APP.owner} · {APP.name} · v{APP.version}</p>
            <div style={{ overflowY: "auto", flex: 1, marginBottom: 14 }}>
              {[
                ["1. Предмет", `Платформа ${APP.name} предоставляется ${APP.owner} для ведения бухгалтерского учёта в соответствии с НК РК 2026.`],
                ["2. Права", "Пользователь обязуется использовать сервис законно. Запрещается передача доступа третьим лицам."],
                ["3. Данные", "Данные хранятся на серверах в РК. Закон РК «О персональных данных» №94-V."],
                ["4. Интеллектуальная собственность", `Все права на ПО, дизайн, алгоритмы принадлежат ${APP.owner}. Копирование ЗАПРЕЩЕНО. Закон РК №6-I.`],
                ["5. Тарифы", "От 3 990 ₸/мес. Оплата через Kaspi Pay, Halyk Bank, перевод."],
                ["6. Право РК", "Договор регулируется законодательством Республики Казахстан."],
              ].map(([title, text]) => (
                <div key={title} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{title}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: 0, lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
              <p style={{ color: C.dim, fontSize: 8, textAlign: "center" }}>{t("copyright")}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <SBtn onClick={() => setShowOffer(false)} C={C} style={{ flex: 1 }}>Закрыть</SBtn>
              <Btn onClick={() => { setAgreed(true); setShowOffer(false); }} col={C.green} style={{ flex: 2 }}>✓ Принимаю</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OnboardScreen({ nav, C, t, lang }) {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("too");
  const [regime, setRegime] = useState("our");
  const [nds, setNds] = useState(true);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 28 }}>
      <div style={{ padding: "14px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => step > 1 ? setStep(s => s - 1) : nav("splash")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 28, padding: 0, lineHeight: 1 }}>‹</button>
        <div>
          <h2 style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>{["", "Тип организации", "Реквизиты", "Налоговый режим", "Банк", "Готово!"][step]}</h2>
          <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Шаг {step} из 5</p>
        </div>
      </div>
      <div style={{ padding: "8px 18px 0", display: "flex", gap: 3 }}>
        {[1, 2, 3, 4, 5].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? C.primary : C.card2 }} />)}
      </div>
      <div style={{ padding: "14px 18px 0" }}>
        {step === 1 && (
          <>
            {[["🏢", "ТОО", "too", "Товарищество с ограниченной ответственностью"],
              ["👤", "ИП", "ip", "Индивидуальный предприниматель"],
              ["🏦", "АО", "ao", "Акционерное общество"],
              ["🌾", "КФХ", "kfh", "Крестьянское/фермерское хозяйство"],
              ["🏘", "КСК/ОСИ", "ksk", "КСК, ОСИ, ЖКХ организации"],
              ["🙋", "Самозанятый", "self", "Без ИП · режим самозанятого"]
            ].map(([ic, s, v, d]) => (
              <div key={v} onClick={() => setOrg(v)} style={{ background: org === v ? C.pSoft : C.card, border: `1.5px solid ${org === v ? C.primary : C.border}`, borderRadius: 14, padding: "12px", marginBottom: 7, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: org === v ? C.primary : C.text, fontSize: 13, fontWeight: 700, margin: "0 0 1px" }}>{s}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${org === v ? C.primary : C.border}`, background: org === v ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {org === v && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                </div>
              </div>
            ))}
            <Btn onClick={() => setStep(2)} col={C.primary} style={{ marginTop: 8 }}>Далее →</Btn>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}25`, borderRadius: 12, padding: "10px 13px", marginBottom: 12, display: "flex", gap: 9, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <p style={{ color: C.green, fontSize: 11, fontWeight: 600, margin: 0 }}>БИН найден в egov.kz · данные загружены</p>
            </div>
            {[["БИН", CO.bin], ["Название", CO.name], ["Правовая форма", "ТОО"], ["Дата рег.", CO.reg], ["Директор", CO.director], ["Адрес", CO.address], ["Телефон", CO.phone]].map(([l, v]) => <Fd key={l} label={l} value={v} C={C} />)}
            <Btn onClick={() => setStep(3)} col={C.primary}>Далее →</Btn>
          </>
        )}
        {step === 3 && (
          <>
            {[["📊", "ОУР", "our", "КПН 20% · НДС 16% · полный учёт", true],
              ["⚡", "СНР (упрощёнка)", "snr", "4% ИПН/КПН · до 2.595 млрд ₸/год", false],
              ["🔖", "СНР (патент)", "patent", "Фиксированный налог · только ИП", false],
              ["👤", "Самозанятый", "self", "4% соц. · без ИПН · до 300 МРП/мес", false],
            ].map(([ic, s, v, d, hot]) => (
              <div key={v} onClick={() => setRegime(v)} style={{ background: regime === v ? C.pSoft : C.card, border: `1.5px solid ${regime === v ? C.primary : C.border}`, borderRadius: 14, padding: "12px", marginBottom: 7, cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{ic}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <p style={{ color: regime === v ? C.primary : C.text, fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{s}</p>
                      {hot && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 8, background: C.pSoft, color: C.primary, fontWeight: 700 }}>NOVA COMP</span>}
                    </div>
                    <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{d}</p>
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${regime === v ? C.primary : C.border}`, background: regime === v ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {regime === v && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ background: C.gSoft, border: `1px solid ${C.gold}22`, borderRadius: 12, padding: "11px 13px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: "0 0 1px" }}>Плательщик НДС (16%)</p>
                  <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Порог: 43 250 000 ₸ (10 000 МРП)</p>
                </div>
                <Toggle on={nds} onToggle={() => setNds(!nds)} col={C.gold} />
              </div>
            </div>
            <Btn onClick={() => setStep(4)} col={C.primary}>Далее →</Btn>
          </>
        )}
        {step === 4 && (
          <>
            <p style={{ color: C.muted, fontSize: 11, margin: "0 0 10px" }}>Реквизиты для счетов и документов</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {["Halyk Bank", "Kaspi Bank", "Jusan Bank", "ForteBank", "BCC"].map(b => (
                <button key={b} style={{ padding: "6px 11px", borderRadius: 10, border: `1.5px solid ${b === "Halyk Bank" ? C.primary : C.border}`, background: b === "Halyk Bank" ? C.pSoft : "transparent", color: b === "Halyk Bank" ? C.primary : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{b}</button>
              ))}
            </div>
            {[["БИК", CO.bik], ["ИИК", CO.iik], ["КБе", "17"]].map(([l, v]) => <Fd key={l} label={l} value={v} C={C} />)}
            <Btn onClick={() => setStep(5)} col={C.green}>Далее →</Btn>
          </>
        )}
        {step === 5 && (
          <>
            <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
              <div style={{ fontSize: 54, marginBottom: 12 }}>🎉</div>
              <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 7px" }}>Всё готово!</h2>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 18px" }}>{CO.name} настроена</p>
            </div>
            {[["✅", "Реквизиты из egov.kz"], ["✅", "Режим ОУР · НДС 16%"], ["✅", "eGov Mobile · eGov Cloud"], ["✅", "ИИ-ассистент НК РК 2026"], ["✅", "Налоговый календарь"], ["✅", "Синхронизация Halyk Bank"]].map(([ic, tx], i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: C.card, borderRadius: 10, padding: "9px 13px", marginBottom: 6, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{ic}</span>
                <p style={{ color: C.text, fontSize: 12, margin: 0 }}>{tx}</p>
              </div>
            ))}
            <Btn onClick={() => nav("home")} col={C.primary} style={{ marginTop: 14 }}>🚀 Начать работу!</Btn>
          </>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ nav, setSelDoc, C, t, lang }) {
  const income  = DOCS_DATA.filter(d => d.dir === "out" && d.pay === "paid").reduce((s, d) => s + d.amount, 0);
  const expense = BANK_OPS.filter(o => o.type === "out").reduce((s, o) => s + Math.abs(o.amount), 0);
  const urgent  = TAXES_DATA.filter(x => x.status === "urgent").reduce((s, x) => s + (x.amount || 0), 0);
  const pending = DOCS_DATA.filter(d => d.pay === "unpaid" && d.dir === "out").reduce((s, d) => s + d.amount, 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      {/* Finance card */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: `linear-gradient(135deg,#1a0f4e,#2d1f8a)`, borderRadius: 20, padding: "17px", border: `1px solid ${C.border2}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(124,111,255,.1)" }} />
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 9, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>{t("income")} · {lang === "kz" ? "Мамыр" : "Май"} 2026</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 13px", letterSpacing: -0.5 }}>{fmt(income)}</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[[t("expense"), expense, "#ef4444"], ["Дебиторка", pending, "#f59e0b"], [t("profit"), income - expense, "#22c55e"]].map(([l, v, c], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.08)", borderRadius: 11, padding: "8px" }}>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: 9, margin: "0 0 3px", lineHeight: 1.2 }}>{l}</p>
                <p style={{ color: c, fontSize: 11, fontWeight: 700, margin: 0 }}>{fmtS(v)} ₸</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Urgent alert */}
      {urgent > 0 && (
        <div style={{ padding: "9px 16px 0" }}>
          <div onClick={() => nav("taxes")} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 14, padding: "11px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, margin: "0 0 1px" }}>Срочно до 15 мая · 3 формы</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>ФНО 200+300 · {fmt(urgent)}</p>
            </div>
            <span style={{ color: "#ef4444", fontSize: 18 }}>›</span>
          </div>
        </div>
      )}
      {/* Quick create */}
      <div style={{ padding: "10px 16px 0" }}>
        <Sec C={C}>{lang === "kz" ? "Құжат жасау" : "Создать документ"}</Sec>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
          {[["🧾", "ЭСФ", "#f59e0b"], ["📋", "ЭАВР", "#06b6d4"], ["📄", lang === "kz" ? "Шот" : "Счёт", "#7c6fff"], ["📜", lang === "kz" ? "Сенімхат" : "Довер.", "#ec4899"], ["📦", lang === "kz" ? "Жүкқ." : "Наклад.", "#64748b"], ["📥", lang === "kz" ? "Кіріс" : "Входящ.", "#22c55e"]].map(([ic, l, c], i) => (
            <button key={i} onClick={() => nav("newDoc")} style={{ background: `${c}12`, border: `1px solid ${c}22`, borderRadius: 14, padding: "12px 5px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 21 }}>{ic}</span>
              <span style={{ color: c, fontSize: 10, fontWeight: 700 }}>{l}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Analytics mini */}
      <div style={{ padding: "8px 16px 0" }}>
        <Sec C={C} action={t("analytics") + " →"} onAction={() => nav("analytics")}>{lang === "kz" ? "Қаржы" : "Финансы"}</Sec>
        <div style={{ background: C.card, borderRadius: 16, padding: "13px", border: `1px solid ${C.border}` }}>
          {[[t("income"), income, C.green], [t("expense"), expense, C.red], [lang === "kz" ? "Салықтар" : "Налоги", urgent, C.gold]].map(([l, v, c]) => (
            <div key={l} style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: C.muted, fontSize: 11 }}>{l}</span>
                <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
              </div>
              <div style={{ height: 5, background: C.dim, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${Math.min(v / income * 100, 100)}%`, background: c, borderRadius: 3, transition: "width 1s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent docs */}
      <div style={{ padding: "8px 16px 0" }}>
        <Sec C={C} action={lang === "kz" ? "Барлығы →" : "Все →"} onAction={() => nav("docs")}>{lang === "kz" ? "Соңғы құжаттар" : "Последние документы"}</Sec>
        {DOCS_DATA.slice(0, 4).map(doc => (
          <div key={doc.id} onClick={() => { setSelDoc(doc); nav("docDetail"); }} style={{ background: C.card, borderRadius: 13, padding: "10px 12px", marginBottom: 6, display: "flex", gap: 9, cursor: "pointer", border: `1px solid ${C.border}` }}>
            <DIcon type={doc.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.cp}</p>
              <p style={{ color: C.dim, fontSize: 9, margin: "2px 0 0" }}>{doc.date} · {doc.type}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {doc.amount > 0 && <p style={{ color: C.text, fontSize: 11, fontWeight: 700, margin: "0 0 3px" }}>{fmt(doc.amount)}</p>}
              <Badge s={doc.pay} map={PAY_MAP} lang={lang} />
            </div>
          </div>
        ))}
      </div>
      {/* Tax calendar */}
      <div style={{ padding: "8px 16px 14px" }}>
        <Sec C={C} action={lang === "kz" ? "Күнтізбе →" : "Календарь →"} onAction={() => nav("calendar")}>{lang === "kz" ? "Салық күнтізбесі" : "Налоговый календарь"}</Sec>
        {TAX_CALENDAR.slice(0, 2).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 9, background: C.card, borderRadius: 12, padding: "9px 11px", marginBottom: 6, border: `1px solid ${item.urgent ? "rgba(239,68,68,.3)" : C.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: item.urgent ? "rgba(239,68,68,.14)" : C.card2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: item.urgent ? "#ef4444" : C.muted, fontSize: 9, fontWeight: 800, textAlign: "center", lineHeight: 1.2 }}>{item.date}</span>
            </div>
            <div style={{ flex: 1 }}>{item.items.slice(0, 2).map((it, j) => <p key={j} style={{ color: C.text, fontSize: 10, margin: "0 0 1px" }}>{it}</p>)}</div>
            {item.amount && <p style={{ color: item.urgent ? "#ef4444" : C.muted, fontSize: 11, fontWeight: 700, margin: 0, alignSelf: "center", flexShrink: 0 }}>{fmt(item.amount)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsScreen({ nav, setSelDoc, C, t, lang }) {
  const [dir, setDir]   = useState("все");
  const [filt, setFilt] = useState("все");
  const [q, setQ]       = useState("");
  const filtered = DOCS_DATA.filter(d =>
    (dir === "все" || d.dir === dir) &&
    (filt === "все" || d.type === filt) &&
    (q === "" || d.cp.toLowerCase().includes(q.toLowerCase()) || d.service.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ padding: "8px 16px 0" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={`🔍 ${lang === "kz" ? "Іздеу..." : "Поиск..."}`}
          style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
      </div>
      <div style={{ padding: "7px 16px 0", display: "flex", gap: 5 }}>
        {[["все", lang === "kz" ? "Барлығы" : "Все"], ["out", "📤"], ["in", "📥"]].map(([v, l]) => (
          <button key={v} onClick={() => setDir(v)} style={{ padding: "5px 11px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: dir === v ? C.primary : C.card2, color: dir === v ? "#fff" : C.muted }}>
            {l === "📤" ? `📤 ${lang === "kz" ? "Шығыс" : "Исход."}` : l === "📥" ? `📥 ${lang === "kz" ? "Кіріс" : "Входящ."}` : l}
          </button>
        ))}
      </div>
      <div style={{ padding: "5px 16px 0", display: "flex", gap: 4, overflowX: "auto" }}>
        {["все", "ЭСФ", "ЭАВР", "АВР", "счёт", "акт", "доверенность", "накладная"].map(f => (
          <button key={f} onClick={() => setFilt(f)} style={{ padding: "3px 9px", borderRadius: 10, border: `1px solid ${filt === f ? C.primary : C.border}`, cursor: "pointer", fontSize: 9, fontWeight: 600, whiteSpace: "nowrap", background: filt === f ? C.pSoft : "transparent", color: filt === f ? C.primary : C.muted, flexShrink: 0 }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: "8px 16px 0" }}>
        {filtered.map(doc => (
          <div key={doc.id} onClick={() => { setSelDoc(doc); nav("docDetail"); }} style={{ background: C.card, borderRadius: 13, padding: "10px 12px", marginBottom: 7, cursor: "pointer", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <DIcon type={doc.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.cp}</p>
                <p style={{ color: C.dim, fontSize: 9, margin: "2px 0 0" }}>{doc.service}</p>
              </div>
              {doc.amount > 0 && <p style={{ color: C.text, fontSize: 11, fontWeight: 700, margin: 0, flexShrink: 0 }}>{fmt(doc.amount)}</p>}
            </div>
            <div style={{ marginTop: 7, paddingTop: 5, borderTop: `1px solid ${C.border}`, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 8, background: doc.dir === "out" ? C.pSoft : "rgba(34,197,94,.12)", color: doc.dir === "out" ? C.primary : C.green, fontWeight: 600 }}>{doc.dir === "out" ? "📤" : "📥"}</span>
              <span style={{ color: C.dim, fontSize: 9 }}>{doc.date}</span>
              <Badge s={doc.pay} map={PAY_MAP} lang={lang} />
              {doc.nds > 0 && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 8, background: C.gSoft, color: C.gold, fontWeight: 600 }}>НДС</span>}
              {doc.signed && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 8, background: "rgba(34,197,94,.12)", color: C.green, fontWeight: 600 }}>🔐 ЭЦП</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: C.muted, textAlign: "center", padding: "32px 0", fontSize: 12 }}>Ничего не найдено</p>}
      </div>
    </div>
  );
}

function DocDetail({ doc, onBack, C, t, lang }) {
  const [showSign, setShowSign] = useState(false);
  if (!doc) return null;
  const base = doc.amount - doc.nds;
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24, position: "relative" }}>
      <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 28, padding: 0, lineHeight: 1 }}>‹</button>
        <h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{DOC_ICONS[doc.type]} {doc.type} №{doc.no}</h2>
        <div style={{ marginLeft: "auto" }}><Badge s={doc.pay} map={PAY_MAP} lang={lang} /></div>
      </div>
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: C.card, borderRadius: 16, padding: "15px", border: `1.5px solid ${DOC_COLORS[doc.type] || C.primary}28`, marginBottom: 10 }}>
          <div style={{ borderBottom: `2px solid ${DOC_COLORS[doc.type] || C.primary}`, paddingBottom: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: DOC_COLORS[doc.type] || C.primary, fontSize: 11, fontWeight: 800, margin: "0 0 2px", textTransform: "uppercase" }}>{doc.type} №{doc.no}</p>
                <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>от {doc.date}</p>
              </div>
              <Logo size={26} />
            </div>
          </div>
          {[["Поставщик", CO.name], ["БИН", CO.bin], ["Банк", CO.bank], ["ИИК", CO.iik]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: C.muted, fontSize: 9 }}>{l}</span>
              <span style={{ color: C.text, fontSize: 9, fontWeight: 600, maxWidth: "55%", textAlign: "right" }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, margin: "4px 0 8px" }}>
            <p style={{ color: C.muted, fontSize: 8, margin: "0 0 2px", textTransform: "uppercase" }}>Покупатель</p>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{doc.cp}</p>
          </div>
          <div style={{ background: C.card2, borderRadius: 10, padding: "10px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: C.muted, fontSize: 10 }}>Услуга</span><span style={{ color: C.text, fontSize: 10, maxWidth: "55%", textAlign: "right" }}>{doc.service}</span></div>
            {doc.nds > 0 && <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: C.muted, fontSize: 10 }}>Без НДС</span><span style={{ color: C.text, fontSize: 10 }}>{fmt(base)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: C.muted, fontSize: 10 }}>НДС 16%</span><span style={{ color: C.gold, fontSize: 10 }}>{fmt(doc.nds)}</span></div>
            </>}
            {doc.amount > 0 && <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>ИТОГО</span>
              <span style={{ color: C.text, fontSize: 14, fontWeight: 900 }}>{fmt(doc.amount)}</span>
            </div>}
          </div>
          {doc.signed
            ? <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", borderRadius: 10, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
              <span>🔐</span>
              <div><p style={{ color: C.green, fontSize: 10, fontWeight: 700, margin: "0 0 1px" }}>Подписан ЭЦП</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{CO.director} · {doc.date}</p></div>
            </div>
            : <div style={{ background: C.gSoft, border: `1px solid ${C.gold}28`, borderRadius: 10, padding: "8px 12px" }}>
              <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, margin: "0 0 1px" }}>⚠️ Требуется подпись ЭЦП</p>
              <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>eGov Mobile / eGov Cloud</p>
            </div>
          }
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
          {[["👁", "PDF"], ["📤", t("send")], ["✏️", t("delete").replace("Удалить", "Изменить")]].map(([ic, l], i) => (
            <button key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 5px", cursor: "pointer", color: C.text, fontSize: 9, fontWeight: 600 }}>{ic}<br />{l}</button>
          ))}
        </div>
        {!doc.signed && <Btn onClick={() => setShowSign(true)} col={C.green} style={{ marginBottom: 8 }}>🔐 {t("sign")}</Btn>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 11, padding: "10px", cursor: "pointer", color: C.red, fontSize: 11, fontWeight: 600 }}>🗑 {t("delete")}</button>
          <button style={{ background: C.pSoft, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px", cursor: "pointer", color: C.primary, fontSize: 11, fontWeight: 600 }}>📋 Копировать</button>
        </div>
      </div>
      {showSign && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "flex-end", zIndex: 50, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", padding: "18px 18px 26px" }}>
            <div style={{ width: 36, height: 4, background: C.dim, borderRadius: 2, margin: "0 auto 16px" }} />
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>🔐 Подписание ЭЦП</h3>
            {[["📱", "eGov Mobile", "QR-код или push-уведомление", "Рекомендовано", C.green], ["☁️", "eGov Cloud", "ЭЦП в облаке · логин/пароль", "Без носителя", C.primary], ["💻", "NCA Layer (ПК)", "USB-токен · только компьютер", "Десктоп", C.gold]].map(([ic, title, desc, note, c], i) => (
              <div key={i} onClick={() => setShowSign(false)} style={{ background: C.card2, borderRadius: 12, padding: "11px 13px", marginBottom: 7, cursor: "pointer", display: "flex", gap: 11, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: "0 0 1px" }}>{title}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: "0 0 3px" }}>{desc}</p>
                  <span style={{ fontSize: 8, padding: "1px 7px", borderRadius: 8, background: `${c}18`, color: c, fontWeight: 600 }}>{note}</span>
                </div>
              </div>
            ))}
            <SBtn onClick={() => setShowSign(false)} C={C}>Отмена</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function NewDocScreen({ onBack, onDone, C, t, lang }) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("ЭСФ");
  const [cp, setCp] = useState(null);
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [withNds, setWithNds] = useState(true);
  const [showCp, setShowCp] = useState(false);
  const total = parseFloat(amount) || 0;
  const nds   = withNds ? Math.round(total * 16 / 116) : 0;
  const types = [["🧾", "ЭСФ", "#f59e0b"], ["📋", "ЭАВР", "#06b6d4"], ["✅", "АВР", "#22c55e"], ["📄", "счёт", "#7c6fff"], ["📜", "доверенность", "#ec4899"], ["📦", "накладная", "#64748b"]];
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24, position: "relative" }}>
      <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 28, padding: 0, lineHeight: 1 }}>‹</button>
        <div><h2 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{lang === "kz" ? "Жаңа құжат" : "Новый документ"}</h2><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Шаг {step} из 3</p></div>
      </div>
      <div style={{ padding: "7px 16px 0", display: "flex", gap: 3 }}>
        {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 2.5, borderRadius: 2, background: s <= step ? C.primary : C.card2 }} />)}
      </div>
      <div style={{ padding: "12px 16px 0" }}>
        {step === 1 && <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {types.map(([ic, tp, c]) => (
              <button key={tp} onClick={() => setDocType(tp)} style={{ padding: "7px 12px", borderRadius: 11, border: `1.5px solid ${docType === tp ? c : C.border}`, background: docType === tp ? `${c}15` : "transparent", color: docType === tp ? c : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{ic} {tp}</button>
            ))}
          </div>
          <button onClick={() => setShowCp(true)} style={{ width: "100%", padding: "11px 14px", borderRadius: 13, marginBottom: 8, background: cp ? C.pSoft : C.card2, border: `1.5px solid ${cp ? C.primary : C.border}`, color: cp ? C.text : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
            <span>{cp ? `👤 ${cp.name}` : "📋 Выбрать контрагента"}</span><span style={{ color: C.primary }}>›</span>
          </button>
          {cp && <div style={{ background: C.card, borderRadius: 11, padding: "9px 13px", marginBottom: 8, border: `1px solid ${C.border}` }}><p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: "0 0 1px" }}>{cp.name}</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>БИН: {cp.bin}</p></div>}
          <Btn onClick={() => setStep(2)}>Далее →</Btn>
        </>}
        {step === 2 && <>
          <Input label="Наименование *" value={service} onChange={setService} placeholder="Разработка сайта" C={C} />
          {docType !== "доверенность" && <>
            <Input label="Сумма (₸)" value={amount} onChange={setAmount} placeholder="1 000 000" C={C} />
            <div onClick={() => setWithNds(!withNds)} style={{ background: withNds ? C.gSoft : C.card2, border: `1.5px solid ${withNds ? C.gold : C.border}`, borderRadius: 12, padding: "11px 13px", marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: "0 0 1px" }}>НДС 16%</p><p style={{ color: C.muted, fontSize: 9, margin: 0 }}>Обязательно для плательщиков НДС</p></div>
              <Toggle on={withNds} onToggle={() => setWithNds(!withNds)} col={C.gold} />
            </div>
            {total > 0 && <div style={{ background: C.pSoft, borderRadius: 13, padding: "12px", marginBottom: 10, border: `1px solid ${C.border}` }}>
              {withNds && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: C.muted, fontSize: 11 }}>Без НДС</span><span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>{fmt(total - nds)}</span></div>}
              {withNds && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: C.muted, fontSize: 11 }}>НДС 16%</span><span style={{ color: C.gold, fontSize: 11, fontWeight: 600 }}>{fmt(nds)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>ИТОГО</span><span style={{ color: C.primary, fontSize: 18, fontWeight: 900 }}>{fmt(total)}</span></div>
            </div>}
          </>}
          <div style={{ display: "flex", gap: 7 }}><SBtn onClick={() => setStep(1)} C={C} style={{ flex: 1 }}>← Назад</SBtn><Btn onClick={() => service && setStep(3)} disabled={!service} style={{ flex: 2 }}>Далее →</Btn></div>
        </>}
        {step === 3 && <>
          <div style={{ background: C.card, borderRadius: 14, padding: "13px", border: `1px solid ${C.border}`, marginBottom: 10 }}>
            <p style={{ color: C.primary, fontSize: 10, fontWeight: 800, margin: "0 0 8px", textTransform: "uppercase" }}>Предпросмотр · {docType}</p>
            {[["Поставщик", CO.name], ["Покупатель", cp?.name || "—"], ["Услуга", service || "—"], total > 0 && ["Сумма", fmt(total)], nds > 0 && ["НДС", fmt(nds)]].filter(Boolean).map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ color: C.muted, fontSize: 10 }}>{l}</span><span style={{ color: C.text, fontSize: 10, fontWeight: 600, maxWidth: "55%", textAlign: "right" }}>{v}</span></div>
            ))}
          </div>
          <div style={{ background: C.gSoft, border: `1px solid ${C.gold}22`, borderRadius: 12, padding: "10px 13px", marginBottom: 10 }}>
            <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 2px" }}>🔐 Требуется подпись ЭЦП</p>
            <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>После сохранения подпишите через eGov Mobile</p>
          </div>
          <div style={{ display: "flex", gap: 7, marginBottom: 8 }}><SBtn onClick={() => setStep(2)} C={C} style={{ flex: 1 }}>← Назад</SBtn><Btn onClick={onDone} style={{ flex: 2 }}>📤 {t("save")}</Btn></div>
          <SBtn onClick={onDone} C={C}>💾 Черновик</SBtn>
        </>}
      </div>
      {showCp && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "flex-end", zIndex: 100, borderRadius: 44 }}>
          <div style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", padding: "16px 16px 24px", maxHeight: "65%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: 36, height: 4, background: C.dim, borderRadius: 2, margin: "0 auto 14px" }} />
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 11px" }}>Выбрать контрагента</p>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {COUNTERPARTIES.map((c, i) => (
                <div key={i} onClick={() => { setCp(c); setShowCp(false); }} style={{ background: C.card2, borderRadius: 12, padding: "11px 13px", marginBottom: 7, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: C.pSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: C.text, flexShrink: 0 }}>{c.name[0]}</div>
                  <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{c.name}</p><p style={{ color: C.dim, fontSize: 9, margin: "2px 0 0" }}>БИН: {c.bin}</p></div>
                </div>
              ))}
            </div>
            <SBtn onClick={() => setShowCp(false)} C={C} style={{ marginTop: 10 }}>Закрыть</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function BankScreen({ C, t, lang }) {
  const [tab, setTab] = useState("ops");
  const income  = BANK_OPS.filter(o => o.type === "in").reduce((s, o) => s + o.amount, 0);
  const expense = BANK_OPS.filter(o => o.type === "out").reduce((s, o) => s + Math.abs(o.amount), 0);
  const cats    = BANK_OPS.filter(o => o.type === "out").reduce((acc, o) => ({ ...acc, [o.cat]: (acc[o.cat] || 0) + Math.abs(o.amount) }), {});
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", gap: 0, background: C.card2, borderRadius: 12, padding: "3px", marginBottom: 12 }}>
          {[["ops", "📊 Операции"], ["sync", "🔄 Синхронизация"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: tab === v ? C.card : "transparent", color: tab === v ? C.text : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ background: `linear-gradient(135deg,#1a0f4e,#2d1f8a)`, borderRadius: 18, padding: "15px", border: `1px solid ${C.border2}`, marginBottom: 12 }}>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 9, margin: 0, textTransform: "uppercase" }}>Halyk Bank · {lang === "kz" ? "Мамыр" : "Май"} 2026</p>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "4px 0 12px" }}>{fmt(income - expense)}</h2>
          <div style={{ display: "flex", gap: 7 }}>
            {[["+ Приход", C.green], ["- Расход", C.red], ["⇄ Перевод", C.primary]].map(([l, c]) => (
              <button key={l} style={{ flex: 1, padding: "7px", borderRadius: 10, background: `${c}20`, border: `1px solid ${c}30`, color: c, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>
        {tab === "ops" && <>
          <div style={{ background: C.card, borderRadius: 14, padding: "12px", border: `1px solid ${C.border}`, marginBottom: 10 }}>
            <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase" }}>Расходы по категориям</p>
            {[["💼", lang === "kz" ? "Жалақы" : "ЗП", cats.salary || 0, C.primary], ["🏛", lang === "kz" ? "Салықтар" : "Налоги", cats.tax || 0, C.gold], ["🏢", lang === "kz" ? "Аренда" : "Аренда+прочее", cats.expense || 0, C.muted]].map(([ic, l, v, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: C.text, fontSize: 11 }}>{l}</span>
                    <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
                  </div>
                  <div style={{ height: 4, background: C.dim, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${v ? Math.min(v / expense * 100, 100) : 0}%`, background: c, borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Sec C={C}>{lang === "kz" ? "Операциялар" : "Операции"}</Sec>
          {BANK_OPS.map(op => (
            <div key={op.id} style={{ background: C.card, borderRadius: 12, padding: "9px 12px", marginBottom: 6, display: "flex", gap: 9, border: `1px solid ${C.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: op.type === "in" ? "rgba(34,197,94,.18)" : "rgba(239,68,68,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{op.type === "in" ? "📈" : "📉"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{op.desc}</p>
                <p style={{ color: C.dim, fontSize: 9, margin: "2px 0 0" }}>{op.date}</p>
              </div>
              <p style={{ color: op.type === "in" ? C.green : C.red, fontSize: 12, fontWeight: 700, margin: 0, flexShrink: 0 }}>{op.type === "in" ? "+" : ""}{fmt(op.amount)}</p>
            </div>
          ))}
        </>}
        {tab === "sync" && (
          <div>
            <Sec C={C}>{lang === "kz" ? "Банктермен синхрондау" : "Синхронизация с банками"}</Sec>
            {[["🏦", "Halyk Bank", true], ["💳", "Kaspi Bank", false], ["🏛", "Jusan Bank", false], ["🏢", "ForteBank", false]].map(([ic, n, on]) => (
              <div key={n} style={{ background: C.card, borderRadius: 12, padding: "12px 13px", marginBottom: 7, border: `1px solid ${on ? `${C.green}30` : C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 600, margin: "0 0 2px" }}>{n}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{on ? "Подключён · синхр. 10 мин. назад" : "Нажмите для подключения"}</p>
                </div>
                <Toggle on={on} onToggle={() => {}} col={C.green} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaxesScreen({ nav, C, t, lang }) {
  const [tab, setTab] = useState("taxes");
  const urgAmt = TAXES_DATA.filter(x => x.status === "urgent").reduce((s, x) => s + (x.amount || 0), 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ margin: "8px 16px 0", display: "flex", gap: 0, background: C.card2, borderRadius: 12, padding: "3px" }}>
        {["taxes", "salary", "reports"].map((tb, i) => (
          <button key={tb} onClick={() => setTab(tb)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: tab === tb ? C.card : "transparent", color: tab === tb ? C.text : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
            {[lang === "kz" ? "Салықтар" : "Налоги", lang === "kz" ? "Жалақы" : "ЗП", lang === "kz" ? "Есептер" : "Отчёты"][i]}
          </button>
        ))}
      </div>
      <div style={{ padding: "10px 16px 0" }}>
        {tab === "taxes" && <>
          <div style={{ background: `linear-gradient(135deg,#2a0e00,#471a00)`, borderRadius: 16, padding: "15px", marginBottom: 12, border: `1px solid ${C.gold}28` }}>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 9, margin: 0, textTransform: "uppercase" }}>{lang === "kz" ? "Шұғыл төленуге (15 мамырға дейін)" : "Срочно к уплате (до 15 мая)"}</p>
            <h2 style={{ color: C.goldL, fontSize: 24, fontWeight: 900, margin: "4px 0 10px" }}>{fmt(urgAmt)}</h2>
            <div style={{ display: "flex", gap: 7 }}>
              {[["💳 Оплатить", C.gold], ["📋 ФНО 200", "rgba(255,255,255,.15)"], ["📋 ФНО 300", "rgba(255,255,255,.15)"]].map(([l, bg]) => (
                <button key={l} style={{ flex: 1, padding: "8px", borderRadius: 10, background: bg, border: "none", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
          </div>
          {TAXES_DATA.map((tx, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 13, padding: "10px 12px", marginBottom: 6, border: `1px solid ${tx.status === "urgent" ? "rgba(239,68,68,.3)" : tx.status === "pending" ? `${C.gold}20` : C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ flex: 1, marginRight: 6 }}>
                  <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 1px" }}>{tx.code} · {tx.rate}</p>
                  <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{tx.form} · до {tx.deadline}</p>
                </div>
                <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 10, fontWeight: 700, background: tx.status === "urgent" ? "rgba(239,68,68,.18)" : tx.status === "pending" ? C.gSoft : C.card2, color: tx.status === "urgent" ? C.red : tx.status === "pending" ? C.gold : C.muted, flexShrink: 0 }}>
                  {tx.status === "urgent" ? "🔴 Срочно" : tx.status === "pending" ? "🟡 Ожидает" : "✅ Планово"}
                </span>
              </div>
              {tx.amount && <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ color: C.dim, fontSize: 8, margin: 0 }}>{tx.note}</p>
                <span style={{ color: tx.status === "urgent" ? C.red : C.text, fontSize: 12, fontWeight: 700 }}>{fmt(tx.amount)}</span>
              </div>}
            </div>
          ))}
        </>}
        {tab === "salary" && <>
          <Sec C={C}>{lang === "kz" ? "Жалақы · Мамыр 2026" : "ЗП · Май 2026 · НК РК"}</Sec>
          {EMPLOYEES.map(emp => {
            const c = calcSalary(emp.salary, emp.type);
            return (
              <div key={emp.id} style={{ background: C.card, borderRadius: 14, padding: "13px", marginBottom: 9, border: `1px solid ${C.border}` }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 1px" }}>{emp.name}</p>
                <p style={{ color: C.muted, fontSize: 9, margin: "0 0 9px" }}>{emp.pos}</p>
                <div style={{ background: C.card2, borderRadius: 10, padding: "10px" }}>
                  {[["Оклад (gross)", fmt(c.gross), C.text, false], ["ОПВ 10%", "-" + fmt(c.opv), C.red, false], ["ВОСМС 2%", "-" + fmt(c.vosms), C.red, false], ["Вычет 30 МРП", fmt(30 * MRP), C.green, false], ["ИПН", "-" + fmt(c.ipn), C.red, false], ["✅ К выплате", fmt(c.net), C.green, true]].map(([l, v, col, b]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: b ? 0 : 4, paddingBottom: b ? 0 : 4, borderBottom: b ? "none" : `1px solid ${C.border}` }}>
                      <span style={{ color: C.muted, fontSize: b ? 11 : 9 }}>{l}</span>
                      <span style={{ color: col, fontSize: b ? 13 : 9, fontWeight: b ? 900 : 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 7, background: C.gSoft, borderRadius: 10, padding: "8px 10px" }}>
                  <p style={{ color: C.gold, fontSize: 9, fontWeight: 700, margin: "0 0 4px" }}>Расходы работодателя:</p>
                  {[["ОПВР 3.5% ↑", fmt(c.opvr)], ["СО 5%", fmt(c.so)], ["СН 6% ↓", fmt(c.sn)], ["ВОСМС 2%", fmt(c.vemp)], ["ИТОГО", fmt(c.total)]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ color: C.muted, fontSize: 9 }}>{l}</span>
                      <span style={{ color: l === "ИТОГО" ? C.red : C.gold, fontSize: 9, fontWeight: l === "ИТОГО" ? 800 : 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Employee categories */}
          <div style={{ background: C.pSoft, border: `1px solid ${C.border}`, borderRadius: 13, padding: "11px 13px", marginTop: 4 }}>
            <p style={{ color: C.primary, fontSize: 11, fontWeight: 700, margin: "0 0 7px" }}>👥 Льготные категории 2026</p>
            {[["🎓 Студент", "ВОСМС — 0% · ОПВ — есть"], ["👴 Пенсионер", "ОПВ/ОПВР/СО/ВОСМС — 0%"], ["♿ Инвалид", "Вычет 882 МРП ≈ 3.8 млн ₸/год"], ["🌍 Нерезидент", "ИПН 20% · без вычетов"]].map(([t2, d]) => (
              <div key={t2} style={{ marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                <p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: "0 0 2px" }}>{t2}</p>
                <p style={{ color: C.muted, fontSize: 9, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </>}
        {tab === "reports" && <>
          <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}20`, borderRadius: 12, padding: "10px 13px", marginBottom: 10 }}>
            <p style={{ color: C.green, fontSize: 11, fontWeight: 700, margin: "0 0 2px" }}>🔐 Отправка через ЭЦП в КНП</p>
            <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>cabinet.salyk.kz · e-Salyq Business</p>
          </div>
          {[["ФНО 100.00", "КПН · Раз в год", "10 апр 2027", "Планово", null], ["ФНО 200.00", "ИПН+СН · Квартально", "15 мая 2026", "СРОЧНО", 329590], ["ФНО 300.00", "НДС · Квартально", "15 мая 2026", "СРОЧНО", 120690], ["ФНО 870.00", "Имущественный · Год", "1 окт 2026", "Планово", null]].map(([f, d, dl, st, amt]) => (
            <div key={f} style={{ background: C.card, borderRadius: 13, padding: "10px 12px", marginBottom: 7, border: `1px solid ${st === "СРОЧНО" ? "rgba(239,68,68,.3)" : C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{f}</p>
                <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 10, fontWeight: 700, background: st === "СРОЧНО" ? "rgba(239,68,68,.18)" : C.card2, color: st === "СРОЧНО" ? C.red : C.muted }}>{st}</span>
              </div>
              <p style={{ color: C.muted, fontSize: 9, margin: "0 0 6px" }}>{d} · до {dl}</p>
              {amt && <div style={{ display: "flex", gap: 5 }}>
                <button style={{ padding: "4px 10px", borderRadius: 8, background: `${C.green}15`, border: `1px solid ${C.green}24`, color: C.green, fontSize: 8, fontWeight: 600, cursor: "pointer" }}>📋 Заполнить</button>
                <button style={{ padding: "4px 10px", borderRadius: 8, background: C.gold, border: "none", color: "#fff", fontSize: 8, fontWeight: 700, cursor: "pointer" }}>💳 {fmt(amt)}</button>
              </div>}
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

function AnalyticsScreen({ C, t, lang }) {
  const income  = DOCS_DATA.filter(d => d.dir === "out" && d.pay === "paid").reduce((s, d) => s + d.amount, 0);
  const expense = BANK_OPS.filter(o => o.type === "out").reduce((s, o) => s + Math.abs(o.amount), 0);
  const months  = [{ m: "Янв", i: 420000, e: 380000 }, { m: "Фев", i: 560000, e: 410000 }, { m: "Мар", i: 890000, e: 520000 }, { m: "Апр", i: 750000, e: 490000 }, { m: "Май", i: income, e: expense }];
  const maxV    = Math.max(...months.map(m => Math.max(m.i, m.e)));
  const [period, setPeriod] = useState("month");
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {[["month", "Месяц"], ["quarter", "Квартал"], ["half", "Полугодие"], ["year", "Год"]].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)} style={{ flex: 1, padding: "6px 4px", borderRadius: 9, border: `1px solid ${period === v ? C.primary : C.border}`, background: period === v ? C.pSoft : "transparent", color: period === v ? C.primary : C.muted, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[[t("income"), income, C.green], [t("expense"), expense, C.red], [t("profit"), income - expense, income > expense ? C.primary : C.red]].map(([l, v, c]) => (
            <div key={l} style={{ background: C.card, borderRadius: 14, padding: "12px 10px", border: `1px solid ${C.border}`, textAlign: "center" }}>
              <p style={{ color: C.muted, fontSize: 8, margin: "0 0 4px", textTransform: "uppercase" }}>{l}</p>
              <p style={{ color: c, fontSize: 11, fontWeight: 900, margin: 0 }}>{fmtS(v)} ₸</p>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, borderRadius: 16, padding: "13px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
          <p style={{ color: C.muted, fontSize: 9, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase" }}>Динамика · {lang === "kz" ? "Кіріс/Шығыс" : "Доходы/Расходы"}</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
            {months.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%" }}>
                  <div style={{ flex: 1, background: C.green, borderRadius: "3px 3px 0 0", height: `${m.i / maxV * 75}px`, minHeight: 4 }} />
                  <div style={{ flex: 1, background: C.red, borderRadius: "3px 3px 0 0", height: `${m.e / maxV * 75}px`, minHeight: 4 }} />
                </div>
                <span style={{ color: C.muted, fontSize: 8 }}>{m.m}</span>
              </div>
            ))}
          </div>
        </div>
        <Sec C={C}>{lang === "kz" ? "Санат бойынша шығыстар" : "Расходы по категориям"}</Sec>
        <div style={{ background: C.card, borderRadius: 14, padding: "13px", border: `1px solid ${C.border}` }}>
          {[["💼", "ЗП", 1118700, C.primary], ["🏛", "Налоги", 370000, C.gold], ["🏢", "Аренда", 310200, C.pink], ["📡", "Связь", 45000, C.cyan]].map(([ic, l, v, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <span style={{ fontSize: 16 }}>{ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: C.text, fontSize: 11 }}>{l}</span>
                  <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>{fmt(v)}</span>
                </div>
                <div style={{ height: 4, background: C.dim, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${v / 1843900 * 100}%`, background: c, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIScreen({ onBack, C, t, lang }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: `${lang === "kz" ? "Сәлем! Мен BizBook KZ ЖИ-көмекшісімін" : "Привет! Я ИИ-ассистент BizBook KZ"} 🤖\n\n${lang === "kz" ? "Маған кез келген сұрақ қойыңыз:" : "Задайте любой вопрос:"}\n• Налоги и расчёты НК РК 2026\n• ЗП · ЭСФ · ФНО · Дивиденды\n• Проверка контрагентов по БИН` }]);
  const [inp, setInp] = useState("");
  const endRef = useRef();
  const sugg = ["Срочные налоги?", "Расчёт ЗП май", "Дивиденды ТОО", "ОПВР 3.5%?", "Что нового в НК?"];
  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInp("");
    setTimeout(() => {
      const tx = text.toLowerCase();
      const r = tx.includes("налог") || tx.includes("срочн") ?
        "**Срочно до 15 мая 2026:**\n\n📊 ФНО 200.00:\n• ИПН: 130 000 ₸\n• СН 6%: 78 900 ₸\n\n🔖 ФНО 300.00 (НДС):\n• 120 690 ₸\n\n**Итого: 329 590 ₸**" :
        tx.includes("зп") || tx.includes("зарплат") ?
        "**ЗП · Май 2026:**\n\n👔 Иванов 600 000 → 503 000 ₸\n👩 Петрова 380 000 → 320 700 ₸\n👨 Сейткали 350 000 → 295 000 ₸\n\n**Итого к выплате: 1 118 700 ₸**" :
        tx.includes("дивид") ?
        "**Дивиденды ТОО 2026:**\n\nИПН: 5% (льготная ставка ст.350)\nОПВ: не удерживается\n\nПример: 1 000 000 ₸\n→ ИПН = 50 000 ₸\n→ К выплате: 950 000 ₸" :
        "Понял! По НК РК 2026 для NOVA COMP:\n\n✅ ОПВР 3.5% (↑ с 2.5%)\n✅ СН 6% (↓ с 11%)\n✅ Вычет 30 МРП = 129 750 ₸\n✅ ЭСФ обязательны при НДС";
      setMsgs(m => [...m, { role: "ai", text: r }]);
    }, 600);
  };
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 16px 8px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 28, padding: 0, lineHeight: 1 }}>‹</button>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: `linear-gradient(135deg,${C.primary},${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
        <div><p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{t("ai")}</p><p style={{ color: C.green, fontSize: 9, margin: 0 }}>● Online · НК РК 2026</p></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "86%", padding: "10px 13px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? C.primary : C.card, border: m.role === "ai" ? `1px solid ${C.border}` : "none" }}>
              <p style={{ color: "#fff", fontSize: 11, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{m.text.replace(/\*\*(.*?)\*\*/g, (_, p) => p)}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "7px 16px 12px", flexShrink: 0, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 7, overflowX: "auto", paddingBottom: 2 }}>
          {sugg.map((s, i) => <button key={i} onClick={() => send(s)} style={{ padding: "4px 9px", borderRadius: 11, background: C.pSoft, border: `1px solid ${C.border}`, color: C.primary, fontSize: 8, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{s}</button>)}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send(inp)} placeholder={lang === "kz" ? "Сұрақ қойыңыз..." : "Задайте вопрос..."} style={{ flex: 1, background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 13px", color: C.text, fontSize: 11, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => send(inp)} style={{ width: 40, height: 40, borderRadius: 12, background: C.primary, border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ nav, C, t, lang, mode, setMode, setLang }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ background: `linear-gradient(135deg,#1a0f4e,#2d1f8a)`, borderRadius: 20, padding: "16px", marginBottom: 14, border: `1px solid ${C.border2}`, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ padding: 8, background: "rgba(255,255,255,.1)", borderRadius: 14 }}><Logo size={32} /></div>
          <div>
            <h3 style={{ color: "#fff", fontSize: 13, fontWeight: 800, margin: "0 0 2px" }}>{CO.name}</h3>
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: 9, margin: "0 0 5px" }}>БИН: {CO.bin} · с {CO.reg}</p>
            <div style={{ display: "flex", gap: 4 }}>{["ОУР", "НДС 16%", "Алматы"].map((tx, i) => <span key={i} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 8, background: "rgba(124,111,255,.35)", color: "#fff", fontWeight: 600 }}>{tx}</span>)}</div>
          </div>
        </div>
        <Sec C={C}>{lang === "kz" ? "Реквизиттер" : "Реквизиты"}</Sec>
        {[["Директор", CO.director], ["Адрес", CO.address], ["Телефон", CO.phone], ["Email", CO.email], ["Банк", CO.bank], ["ИИК", CO.iik]].map(([l, v]) => <Fd key={l} label={l} value={v} C={C} />)}
        <Sec C={C}>{lang === "kz" ? "Қызметкерлер" : "Сотрудники"}</Sec>
        {EMPLOYEES.map(emp => (
          <div key={emp.id} style={{ background: C.card, borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: C.pSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.text, flexShrink: 0 }}>{emp.name[0]}</div>
            <div style={{ flex: 1 }}><p style={{ color: C.text, fontSize: 11, fontWeight: 600, margin: 0 }}>{emp.name}</p><p style={{ color: C.muted, fontSize: 9, margin: "1px 0 0" }}>{emp.pos}</p></div>
            <p style={{ color: C.primary, fontSize: 11, fontWeight: 700, margin: 0 }}>{fmt(emp.salary)}</p>
          </div>
        ))}
        <Sec C={C}>{lang === "kz" ? "Баптаулар" : "Настройки"}</Sec>
        <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 12 }}>
          {[["🏢", lang === "kz" ? "Компания деректері" : "Данные компании"], ["📋", lang === "kz" ? "Салық режимі" : "Налоговый режим"], ["🏦", lang === "kz" ? "Банк шоттары" : "Банковские счета"], ["🔐", "ЭЦП и сертификаты"], ["🔗", lang === "kz" ? "Интеграциялар" : "Интеграции"], ["🔔", lang === "kz" ? "Хабарламалар" : "Уведомления"], ["📊", lang === "kz" ? "Тариф жоспары" : "Тарифный план"], ["❓", lang === "kz" ? "Қолдау" : "Поддержка 24/7"]].map(([ic, l], i, a) => (
            <div key={i} style={{ padding: "12px 13px", borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <span style={{ fontSize: 16 }}>{ic}</span>
              <span style={{ color: C.text, fontSize: 11, fontWeight: 400, flex: 1 }}>{l}</span>
              <span style={{ color: C.dim, fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, borderRadius: 13, padding: "11px 13px", marginBottom: 12, border: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ color: C.muted, fontSize: 8, margin: "0 0 2px" }}>{t("copyright")}</p>
          <p style={{ color: C.dim, fontSize: 7, margin: 0 }}>Закон РК «Об авторском праве» №6-I · v{APP.version}</p>
        </div>
        <button onClick={() => nav("splash")} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: C.red, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ onDone, C }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
      <h2 style={{ color: C.text, fontSize: 21, fontWeight: 900, margin: "0 0 7px", textAlign: "center" }}>Готово!</h2>
      <p style={{ color: C.muted, fontSize: 11, textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 }}>Документ создан и готов к подписанию</p>
      <div style={{ display: "flex", gap: 6, width: "100%", marginBottom: 9 }}>
        {[["💬", "WhatsApp"], ["✈️", "Telegram"], ["📧", "Email"], ["📱", "SMS"]].map(([ic, l], i) => (
          <button key={i} onClick={onDone} style={{ flex: 1, padding: "9px 3px", borderRadius: 11, background: C.card, border: `1px solid ${C.border}`, color: C.text, fontSize: 8, fontWeight: 600, cursor: "pointer" }}>{ic}<br />{l}</button>
        ))}
      </div>
      <Btn onClick={onDone} col={C.primary}>← На главную</Btn>
    </div>
  );
}

// ─── WATERMARK ────────────────────────────────────────────────────
const WaterMark = () => (
  <div style={{ position: "fixed", bottom: 0, right: 0, opacity: .013, fontSize: 6, color: "#fff", writingMode: "vertical-rl", padding: "3px", letterSpacing: 2, pointerEvents: "none", userSelect: "none", zIndex: 9999, lineHeight: 1.2 }}>
    {"© 2026 ТОО «NOVA Comp» BizBook KZ v4 All Rights Reserved Закон РК «Об авторском праве» №6-I ".repeat(6)}
  </div>
);

// ─── APP ROOT ─────────────────────────────────────────────────────
const AUTH_SCREENS = new Set(["splash", "onboard"]);

export default function App() {
  const { C, mode, setMode } = useTheme();
  const { lang, setLang, t  } = useLang();
  const [screen, setScreen]   = useState("splash");
  const [selDoc, setSelDoc]   = useState(null);
  const [menuOpen, setMenu]   = useState(false);
  const vw = useVw();
  const nav = useCallback(s => { setScreen(s); setMenu(false); }, []);

  const isMd = vw >= 768;
  const isLg = vw >= 1200;
  const isAuth = AUTH_SCREENS.has(screen);

  const titles = { home: t("home"), docs: t("docs"), bank: t("bank"), taxes: t("taxes"), analytics: t("analytics"), calendar: t("calendar"), news: t("news"), ai: t("ai"), profile: t("profile") };
  const title = titles[screen] || APP.name;

  const renderScreen = () => {
    switch (screen) {
      case "splash":    return <SplashScreen nav={nav} C={C} t={t} lang={lang} />;
      case "onboard":   return <OnboardScreen nav={nav} C={C} t={t} lang={lang} />;
      case "home":      return <HomeScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang} />;
      case "docs":      return <DocsScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang} />;
      case "docDetail": return <DocDetail doc={selDoc} onBack={() => nav("docs")} C={C} t={t} lang={lang} />;
      case "newDoc":    return <NewDocScreen onBack={() => nav("home")} onDone={() => nav("success")} C={C} t={t} lang={lang} />;
      case "bank":      return <BankScreen C={C} t={t} lang={lang} />;
      case "taxes":     return <TaxesScreen nav={nav} C={C} t={t} lang={lang} />;
      case "analytics": return <AnalyticsScreen C={C} t={t} lang={lang} />;
      case "ai":        return <AIScreen onBack={() => nav("home")} C={C} t={t} lang={lang} />;
      case "profile":   return <ProfileScreen nav={nav} C={C} t={t} lang={lang} mode={mode} setMode={setMode} setLang={setLang} />;
      case "success":   return <SuccessScreen onDone={() => nav("home")} C={C} />;
      case "calendar":  return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.muted }}>📅 {t("calendar")}</p></div>;
      case "news":      return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.muted }}>📰 {t("news")}</p></div>;
      default:          return <HomeScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang} />;
    }
  };

  // ── MOBILE ────────────────────────────────────────────────────
  if (!isMd) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#06060f", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <div style={{ width: Math.min(390, vw), height: "100dvh", maxHeight: 844, background: C.bg, borderRadius: vw <= 390 ? 0 : 44, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: vw <= 390 ? "none" : "0 40px 120px rgba(0,0,0,.99),0 0 0 1px rgba(124,111,255,.1)" }}>
          {!isAuth && (
            <div style={{ padding: "11px 22px 3px", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>9:41</span>
              <span style={{ color: C.text, fontSize: 9 }}>●●●● WiFi 🔋</span>
            </div>
          )}
          {!isAuth && !["ai", "docDetail", "newDoc", "onboard"].includes(screen) && (
            <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <button onClick={() => setMenu(true)} style={{ width: 38, height: 38, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>☰</button>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h2>
                {screen === "home" && <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{CO.name} · ОУР · НДС</p>}
              </div>
              {screen === "home" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => nav("ai")} style={{ background: C.pSoft, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "6px 10px", color: C.primary, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🤖</button>
                  <button onClick={() => nav("profile")} style={{ width: 33, height: 33, borderRadius: 16, background: `linear-gradient(135deg,${C.primary},${C.pink})`, border: "none", fontSize: 14, cursor: "pointer" }}>👤</button>
                </div>
              )}
              {screen === "docs" && <button onClick={() => nav("newDoc")} style={{ background: C.primary, border: "none", borderRadius: 14, padding: "5px 13px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t("create")}</button>}
            </div>
          )}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{renderScreen()}</div>
          <SideMenu open={menuOpen} onClose={() => setMenu(false)} screen={screen} nav={nav} C={C} t={t} mode={mode} setMode={setMode} lang={lang} setLang={setLang} />
        </div>
        <WaterMark />
      </div>
    );
  }

  // ── TABLET / DESKTOP ──────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      {!isAuth && <DesktopSidebar screen={screen} nav={nav} C={C} t={t} mode={mode} setMode={setMode} lang={lang} setLang={setLang} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {isAuth ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: `radial-gradient(ellipse at 30% 20%, rgba(124,111,255,.18), ${C.bg} 65%)` }}>
            <div style={{ width: Math.min(440, vw - 280), minWidth: 320, background: C.card, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 80px rgba(0,0,0,.4)", border: `1px solid ${C.border}` }}>
              {renderScreen()}
            </div>
          </div>
        ) : (
          <>
            {!["ai", "docDetail", "newDoc"].includes(screen) && (
              <div style={{ padding: "16px 24px 0", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: C.text, fontSize: 19, fontWeight: 800, margin: 0 }}>{title}</h2>
                  {screen === "home" && <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{CO.name} · ОУР · НДС · Алматы</p>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => nav("ai")} style={{ background: C.pSoft, border: `1px solid ${C.border2}`, borderRadius: 12, padding: "8px 14px", color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🤖 {t("ai")}</button>
                  {screen === "docs" && <button onClick={() => nav("newDoc")} style={{ background: C.primary, border: "none", borderRadius: 12, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ {t("create")}</button>}
                </div>
              </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", padding: isLg ? "8px 24px 24px" : "8px 16px 16px" }}>
              <div style={{ maxWidth: isLg ? 1100 : 800, margin: "0 auto" }}>
                {renderScreen()}
              </div>
            </div>
          </>
        )}
      </div>
      <WaterMark />
    </div>
  );
}
