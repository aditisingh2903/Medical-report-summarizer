function parseConditions(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map(c => (typeof c === 'string' ? c : c.name || c.condition || JSON.stringify(c)))
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(c => (typeof c === 'string' ? c : c.name || c.condition || JSON.stringify(c)))
      return [raw]
    } catch {
      return raw.split(/[\n,;]/).map(s => s.trim()).filter(Boolean)
    }
  }
  return []
}

function parseSummary(raw) {
  if (!raw) return ''
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (typeof parsed === 'string') return parsed
      if (parsed.summary) return parsed.summary
      return JSON.stringify(parsed, null, 2)
    } catch {
      return raw
    }
  }
  return String(raw)
}

export default function ResultCard({ result, fromHistory }) {
  const summary = parseSummary(result?.summary)
  const conditions = parseConditions(result?.conditionsDetected)
  const fileName = result?.fileName
  const status = result?.status
  const createdAt = result?.createdAt

  return (
    <div style={styles.card} className="animate-fade-in">
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div>
            <div style={styles.headerTitle}>
              {fromHistory ? 'Report Analysis' : 'Analysis Complete'}
            </div>
            {fileName && <div style={styles.headerSub}>{fileName}</div>}
          </div>
        </div>
        <div style={styles.headerRight}>
          {createdAt && (
            <div style={styles.timestamp}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
          {status && <StatusBadge status={status} />}
        </div>
      </div>

      {summary ? (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Clinical Summary
          </div>
          <div style={styles.summaryText}>{summary}</div>
        </div>
      ) : (
        <div style={styles.emptySection}>
          <span style={{ opacity: 0.4 }}>No summary available</span>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          Detected Conditions
          {conditions.length > 0 && (
            <span style={styles.conditionCount}>{conditions.length}</span>
          )}
        </div>
        {conditions.length > 0 ? (
          <ul style={styles.conditionList}>
            {conditions.map((c, i) => (
              <li key={i} style={styles.conditionItem} className="animate-fade-in">
                <div style={styles.conditionDot} />
                <span style={styles.conditionText}>{c}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={styles.noConditions}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>No conditions detected</span>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>This analysis is for informational purposes only. Consult a healthcare professional for medical advice.</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    uploaded: { bg: 'var(--gray-100)', color: 'var(--gray-600)', label: 'Uploaded' },
    processing: { bg: 'var(--yellow-100)', color: 'var(--yellow-600)', label: 'Processing' },
    completed: { bg: 'var(--green-100)', color: 'var(--green-600)', label: 'Completed' },
  }
  const s = map[status] || map.uploaded
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px',
      background: s.bg, color: s.color,
      borderRadius: 99, fontSize: '0.78rem', fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #16a34a, #0d9488)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(22,163,74,0.25)',
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--gray-900)',
    fontFamily: 'var(--font-display)',
  },
  headerSub: {
    fontSize: '0.78rem',
    color: 'var(--gray-500)',
    marginTop: 2,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
  },
  section: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-light)',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--gray-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 14,
  },
  conditionCount: {
    marginLeft: 4,
    background: 'var(--blue-100)',
    color: 'var(--blue-700)',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: 99,
  },
  summaryText: {
    fontSize: '0.9rem',
    lineHeight: 1.75,
    color: 'var(--gray-700)',
    padding: '16px',
    background: 'var(--bg)',
    borderRadius: 10,
    border: '1px solid var(--border-light)',
    whiteSpace: 'pre-wrap',
  },
  emptySection: {
    padding: '20px 24px',
    fontSize: '0.85rem',
    color: 'var(--gray-400)',
    borderBottom: '1px solid var(--border-light)',
  },
  conditionList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  conditionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 14px',
    background: 'var(--bg)',
    borderRadius: 8,
    border: '1px solid var(--border-light)',
    transition: 'var(--transition)',
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
    flexShrink: 0,
    marginTop: 6,
  },
  conditionText: {
    fontSize: '0.88rem',
    color: 'var(--gray-700)',
    lineHeight: 1.5,
  },
  noConditions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: 'var(--bg)',
    borderRadius: 8,
    fontSize: '0.85rem',
    color: 'var(--gray-500)',
  },
  footer: {
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
    background: 'var(--bg)',
    lineHeight: 1.5,
  },
}
