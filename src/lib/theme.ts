/* ═══════════════════════════════════════════════════════
   VOXAI CRM — Theme Constants
   Centralized chart colors, gradient helpers, and
   reusable Recharts styling tokens.
   ═══════════════════════════════════════════════════════ */

// ─── Chart palette (mirrors CSS --chart-* vars) ─────────
export const CHART_COLORS = {
  primary: "hsl(250 80% 60%)",    // --chart-1  muted indigo/lilac
  teal: "hsl(220 90% 60%)",       // --chart-2  soft blue
  violet: "hsl(180 80% 50%)",     // --chart-3  pale cyan
  amber: "hsl(43 96% 62%)",       // --chart-4  muted gold
  rose: "hsl(339 90% 60%)",       // --chart-5  soft rose
} as const;

export const CHART_COLORS_ARRAY = Object.values(CHART_COLORS);

// ─── Recharts axis / grid styling ───────────────────────
export const AXIS_STYLE = {
  fontSize: 10,
  fill: "hsl(240 10% 50%)",
} as const;

export const GRID_COLOR = "hsl(240 6% 90%)";

export const AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tick: AXIS_STYLE,
} as const;

// ─── Gradient factory for area fills ────────────────────
export function areaGradientId(name: string) {
  return `gradient-area-${name}`;
}

export function areaGradientDef(
  name: string,
  color: string,
  topOpacity = 0.2,
  bottomOpacity = 0,
) {
  return { id: areaGradientId(name), color, topOpacity, bottomOpacity };
}

// ─── Active dot styling ─────────────────────────────────
export function activeDotStyle(color: string) {
  return {
    r: 4,
    fill: color,
    stroke: "hsl(35 24% 98.6%)",
    strokeWidth: 2,
  };
}

// ─── Background color (for active dot strokes etc.) ─────
export const BG_COLOR = "hsl(35 24% 98.6%)";
