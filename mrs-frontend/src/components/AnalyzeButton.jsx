export default function AnalyzeButton({ onAnalyze, analyzing, disabled }) {
  return (
    <button
      onClick={onAnalyze}
      disabled={disabled}
      style={{
        ...styles.btn,
        opacity: disabled ? 0.65 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: disabled ? 'none' : undefined,
      }}
    >
      <div style={styles.btnInner}>
        {analyzing ? (
          <>
            <span style={styles.spinner} />
            <span>Analyzing with AI...</span>
          </>
        ) : (
          <>
            <div style={styles.iconCircle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div style={styles.textBlock}>
              <div style={styles.btnTitle}>Analyze with AI</div>
              <div style={styles.btnSub}>Detect conditions & generate summary</div>
            </div>
            <div style={styles.arrow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </>
        )}
      </div>
      {!analyzing && <div style={styles.shine} />}
    </button>
  )
}

const styles = {
  btn: {
    width: '100%',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
    color: 'white',
    borderRadius: 14,
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 6px 20px rgba(13,148,136,0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  btnInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    position: 'relative',
    zIndex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: { flex: 1, textAlign: 'left' },
  btnTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  btnSub: {
    fontSize: '0.78rem',
    opacity: 0.8,
    marginTop: 3,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
    transform: 'skewX(-20deg)',
    transition: 'left 0.5s ease',
    pointerEvents: 'none',
  },
}
