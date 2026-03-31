import ReportCard from './ReportCard.jsx'
import Loader from './Loader.jsx'

export default function HistoryList({ reports, loading, onSelect, onRefresh }) {
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <Loader size={40} />
        <div style={styles.loadingText}>Loading your reports...</div>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageTitle}>Report History</div>
          <div style={styles.pageSub}>
            {reports.length > 0
              ? `${reports.length} report${reports.length !== 1 ? 's' : ''} found`
              : 'No reports yet'}
          </div>
        </div>
        <button style={styles.refreshBtn} onClick={onRefresh}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
          </svg>
          Refresh
        </button>
      </div>

      {reports.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div style={styles.emptyTitle}>No reports yet</div>
          <div style={styles.emptyDesc}>Upload and analyze your first medical report to see it here.</div>
        </div>
      ) : (
        <div style={styles.grid}>
          {reports.map((report, i) => {
  let parsed = { summary: "", conditions: [] }

  try {
    const clean = (report.summary || "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    parsed = JSON.parse(clean)
  } catch (err) {
    console.log("History parse error:", err)
  }

  return (
    <ReportCard
      key={report._id}
      report={{
        ...report,
        summary: parsed.summary,
        conditionsDetected: parsed.conditions,
      }}
      onSelect={onSelect}
      index={i}
    />
  )
})}
        </div>
      )}
    </div>
  )
}

const styles = {
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: 16,
  },
  loadingText: {
    fontSize: '0.9rem',
    color: 'var(--gray-400)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: 'var(--gray-900)',
    marginBottom: 4,
  },
  pageSub: {
    fontSize: '0.85rem',
    color: 'var(--gray-400)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 16px',
    borderRadius: 8,
    background: 'white',
    border: '1px solid var(--border)',
    color: 'var(--gray-600)',
    fontSize: '0.83rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    background: 'white',
    border: '1px dashed var(--border)',
    borderRadius: 16,
    textAlign: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--gray-300)',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--gray-600)',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: '0.85rem',
    color: 'var(--gray-400)',
    maxWidth: 320,
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
}
