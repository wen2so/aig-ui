/** 结果与空态共用的精密状态图形，文字由外层组件表达。 */
export function StatusGlyph({ success = false, empty = false }: { success?: boolean; empty?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="aig-status-glyph"
    >
      <circle
        className="aig-status-glyph-orbit"
        cx="60"
        cy="60"
        r="55"
        strokeWidth=".8"
        strokeDasharray="2 7"
      />
      <circle
        className="aig-status-glyph-arc"
        cx="60"
        cy="60"
        r="47"
        strokeWidth="1"
        strokeDasharray="74 221"
      />
      <path className="aig-status-glyph-frame" d="M60 21 94 80 26 80Z" strokeWidth="1.4" pathLength="1" />
      <path
        className="aig-status-glyph-detail"
        d={success ? 'm46 60 10 10 20-23' : empty ? 'M45 61h30' : 'M60 43v19m0 8v2'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <path d="M60 0v5m0 110v5M0 60h5m110 0h5" strokeWidth="1" opacity=".5" />
    </svg>
  );
}
