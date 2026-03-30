export default function ReportCard({ report, onSelect, index }) {
  const statusMap = {
    uploaded: { bg: 'var(--gray-100)', color: 'var(--gray-600)', dot: 'var(--gray-400)', label: 'Uploaded', icon: '📄' },
    processing: { bg: 'var(--yellow-100)', color: 'var(--yellow-600)', dot: 'var(--yellow-500)', label: 'Processing', icon: '⚙️' },
    completed: { bg: 'var(--green-100)', color: 'var(--green-600)', dot: 'var(--green-500)', label: 'Completed', icon: '✅' },
  }
  const s = statusMap[report.status] || statusMap.uploaded

  const conditionsCount = Array.isArray(report.conditionsDetected)
    ? report.conditionsDetected.length
    : 0

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : 'Unknown date'

  return (
    <div
      style={{ ...styles.card, animationDelay: `${index * 0.05}s` }}
      className="animate-fade-in"
      onClick={() => onSelect(report)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(report)}
    >
      <div style={styles.cardTop}>
        <div style={styles.fileIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div style={styles.topRight}>
          <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
            {s.label}
          </span>
        </div>
      </div>

      <div style={styles.fileName} title={report.fileName}>
        {report.fileName || 'Untitled Report'}
      </div>

      <div style={styles.meta}>
        <div style={styles.metaItem}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formattedDate}
        </div>
        {conditionsCount > 0 && (
          <div style={styles.metaItem}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            {conditionsCount} condition{conditionsCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {report.summary && (
        <div style={styles.summaryPreview}>
          {typeof report.summary === 'string'
            ? report.summary.slice(0, 100) + (report.summary.length > 100 ? '...' : '')
            : ''}
        </div>
      )}

      <div style={styles.cardFooter}>
        <span style={styles.viewLink}>
          View details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    ':hover': {
      boxShadow: 'var(--shadow-lg)',
      transform: 'translateY(-2px)',
      borderColor: 'var(--blue-200)',
    },
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: '#fef2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#dc2626',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 9px',
    borderRadius: 99,
    fontSize: '0.72rem',
    fontWeight: 600,
  },
  fileName: {
    fontWeight: 600,
    fontSize: '0.88rem',
    color: 'var(--gray-800)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: 8,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
  },
  summaryPreview: {
    fontSize: '0.78rem',
    color: 'var(--gray-500)',
    lineHeight: 1.5,
    padding: '8px 10px',
    background: 'var(--bg)',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: 10,
    borderTop: '1px solid var(--border-light)',
  },
  viewLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--blue-600)',
  },
}
