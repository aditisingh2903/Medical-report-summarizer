import { useState, useEffect } from 'react'
import UploadCard from '../components/UploadCard.jsx'
import AnalyzeButton from '../components/AnalyzeButton.jsx'
import ResultCard from '../components/ResultCard.jsx'
import HistoryList from '../components/HistoryList.jsx'
import Loader from '../components/Loader.jsx'

const BASE_URL = 'http://localhost:3000'

export default function Dashboard({ token, user, onLogout, showToast }) {
  const [activeTab, setActiveTab] = useState('analyze')
  const [reportId, setReportId] = useState(null)
  const [result, setResult] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  }

  const fetchReports = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/reports`, { headers: authHeaders })
      const data = await res.json()
      if (res.ok) {
        setReports(Array.isArray(data) ? data : data.reports || [])
      } else {
        showToast(data.message || 'Failed to fetch reports.', 'error')
      }
    } catch (err) {
      showToast('Failed to load report history.', 'error')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleUpload = async (file) => {
    setLoading(true)
    setUploadStatus('uploading')
    setResult(null)
    setReportId(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${BASE_URL}/api/reports/upload`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || 'Upload failed.', 'error')
        setUploadStatus('error')
        return
      }
      const id = data.reportId || data._id || data.report?._id
      setReportId(id)
      setUploadStatus('success')
      showToast('Report uploaded successfully!', 'success')
      fetchReports()
    } catch (err) {
      showToast('Upload failed. Please try again.', 'error')
      setUploadStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!reportId) return
    setAnalyzing(true)
    setResult(null)
    try {
      const res = await fetch(`${BASE_URL}/api/reports/process`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || 'Analysis failed.', 'error')
        return
      }
      setResult(data)
      showToast('Analysis complete!', 'success')
      fetchReports()
    } catch (err) {
      showToast('Analysis failed. Please try again.', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSelectReport = (report) => {
    setSelectedReport(report)
    setActiveTab('detail')
    setSidebarOpen(false)
  }

  const completedCount = reports.filter(r => r.status === 'completed').length
  const processingCount = reports.filter(r => r.status === 'processing').length

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', '@media (min-width: 768px)': { transform: 'none' } }}>
        <div style={styles.sidebarInner}>
          <div style={styles.sidebarBrand}>
            <div style={styles.sidebarLogo}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M14 6v16M6 14h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={styles.sidebarBrandName}>MediScan AI</div>
              <div style={styles.sidebarBrandSub}>Medical Analyzer</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <div style={styles.navSection}>
              <div style={styles.navSectionLabel}>Workspace</div>
              {[
                { id: 'analyze', label: 'Analyze Report', icon: <AnalyzeIcon /> },
                { id: 'history', label: 'Report History', icon: <HistoryIcon />, badge: reports.length },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                  style={{
                    ...styles.navItem,
                    ...(activeTab === item.id || (item.id === 'history' && activeTab === 'detail') ? styles.navItemActive : {}),
                  }}
                >
                  <span style={styles.navItemIcon}>{item.icon}</span>
                  <span style={styles.navItemLabel}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={styles.navBadge}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          <div style={styles.sidebarStats}>
            <div style={styles.statCard}>
              <div style={styles.statNum}>{reports.length}</div>
              <div style={styles.statDesc}>Total Reports</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNum, color: 'var(--green-600)' }}>{completedCount}</div>
              <div style={styles.statDesc}>Completed</div>
            </div>
            {processingCount > 0 && (
              <div style={styles.statCard}>
                <div style={{ ...styles.statNum, color: 'var(--yellow-600)' }}>{processingCount}</div>
                <div style={styles.statDesc}>Processing</div>
              </div>
            )}
          </div>

          <div style={styles.sidebarUser}>
            <div style={styles.userAvatar}>
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.name || 'User'}</div>
              <div style={styles.userEmail}>{user?.email || ''}</div>
            </div>
            <button onClick={onLogout} style={styles.logoutBtn} title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={styles.headerTitle}>
            {activeTab === 'analyze' && 'Analyze Report'}
            {activeTab === 'history' && 'Report History'}
            {activeTab === 'detail' && 'Report Detail'}
          </div>
          <div style={styles.headerRight}>
            <div style={styles.headerUserPill}>
              <div style={styles.headerUserDot} />
              <span>{user?.name || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {activeTab === 'analyze' && (
            <div style={styles.analyzeGrid} className="animate-fade-in">
              <div style={styles.analyzeMain}>
                <UploadCard onUpload={handleUpload} loading={loading} uploadStatus={uploadStatus} />
                {reportId && (
                  <div style={styles.analyzeActions} className="animate-fade-in">
                    <div style={styles.readyBanner}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green-600)' }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Report uploaded — ready to analyze</span>
                    </div>
                    <AnalyzeButton onAnalyze={handleAnalyze} analyzing={analyzing} disabled={analyzing} />
                  </div>
                )}
                {analyzing && (
                  <div style={styles.analyzingCard} className="animate-fade-in">
                    <Loader size={40} />
                    <div>
                      <div style={styles.analyzingTitle}>AI Analysis in Progress</div>
                      <div style={styles.analyzingDesc}>Extracting conditions and generating clinical summary...</div>
                    </div>
                  </div>
                )}
                {result && !analyzing && <ResultCard result={result} />}
              </div>

              <div style={styles.analyzeSide}>
                <div style={styles.tipsCard}>
                  <div style={styles.tipsTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    How it works
                  </div>
                  {[
                    ['1', 'Upload', 'Upload a PDF medical report (lab results, imaging, etc.)'],
                    ['2', 'Analyze', 'Click Analyze — our AI extracts text and detects conditions'],
                    ['3', 'Review', 'Get a clinical summary with detected conditions listed'],
                  ].map(([num, title, desc]) => (
                    <div key={num} style={styles.tipItem}>
                      <div style={styles.tipNum}>{num}</div>
                      <div>
                        <div style={styles.tipTitle}>{title}</div>
                        <div style={styles.tipDesc}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {reports.length > 0 && (
                  <div style={styles.recentCard}>
                    <div style={styles.recentTitle}>Recent Reports</div>
                    {reports.slice(0, 3).map(r => (
                      <button key={r._id} style={styles.recentItem} onClick={() => handleSelectReport(r)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue-400)', flexShrink: 0 }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={styles.recentFileName}>{r.fileName}</div>
                          <StatusBadge status={r.status} small />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <HistoryList
                reports={reports}
                loading={historyLoading}
                onSelect={handleSelectReport}
                onRefresh={fetchReports}
              />
            </div>
          )}

          {activeTab === 'detail' && selectedReport && (
            <div className="animate-fade-in">
              <button style={styles.backBtn} onClick={() => setActiveTab('history')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to History
              </button>
              <ResultCard result={selectedReport} fromHistory />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status, small }) {
  const map = {
    uploaded: { bg: 'var(--gray-100)', color: 'var(--gray-600)', label: 'Uploaded' },
    processing: { bg: 'var(--yellow-100)', color: 'var(--yellow-600)', label: 'Processing' },
    completed: { bg: 'var(--green-100)', color: 'var(--green-600)', label: 'Completed' },
  }
  const s = map[status] || map.uploaded
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 7px' : '3px 10px',
      background: s.bg, color: s.color,
      borderRadius: 99, fontSize: small ? '0.7rem' : '0.78rem', fontWeight: 500,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

function AnalyzeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
    </svg>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 100,
    background: 'white',
    borderRight: '1px solid var(--border)',
    boxShadow: 'var(--shadow-md)',
    transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
  },
  sidebarInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden',
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '24px 20px',
    borderBottom: '1px solid var(--border-light)',
  },
  sidebarLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
  },
  sidebarBrandName: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--gray-900)',
  },
  sidebarBrandSub: {
    fontSize: '0.72rem',
    color: 'var(--gray-400)',
    marginTop: 1,
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    overflowY: 'auto',
  },
  navSection: { marginBottom: 8 },
  navSectionLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: 'var(--gray-400)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '0 8px',
    marginBottom: 6,
  },
  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--gray-600)',
    fontSize: '0.88rem',
    fontWeight: 500,
    transition: 'var(--transition)',
    marginBottom: 2,
    cursor: 'pointer',
    border: 'none',
  },
  navItemActive: {
    background: 'var(--blue-50)',
    color: 'var(--blue-700)',
  },
  navItemIcon: {
    display: 'flex',
    flexShrink: 0,
    opacity: 0.8,
  },
  navItemLabel: { flex: 1, textAlign: 'left' },
  navBadge: {
    background: 'var(--blue-100)',
    color: 'var(--blue-700)',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 99,
  },
  sidebarStats: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    borderTop: '1px solid var(--border-light)',
    borderBottom: '1px solid var(--border-light)',
  },
  statCard: {
    flex: 1,
    background: 'var(--bg)',
    borderRadius: 8,
    padding: '10px 8px',
    textAlign: 'center',
  },
  statNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--blue-600)',
    lineHeight: 1,
  },
  statDesc: {
    fontSize: '0.68rem',
    color: 'var(--gray-400)',
    marginTop: 3,
  },
  sidebarUser: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 16px',
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: {
    fontSize: '0.83rem',
    fontWeight: 600,
    color: 'var(--gray-800)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userEmail: {
    fontSize: '0.72rem',
    color: 'var(--gray-400)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: 'var(--gray-100)',
    color: 'var(--gray-500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'var(--transition)',
    cursor: 'pointer',
    border: 'none',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 99,
    backdropFilter: 'blur(2px)',
  },
  main: {
    flex: 1,
    marginLeft: 260,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    height: 60,
    background: 'white',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 16,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  menuBtn: {
    display: 'none',
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'var(--bg)',
    color: 'var(--gray-600)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: 'none',
    cursor: 'pointer',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--gray-900)',
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  headerUserPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '5px 12px',
    background: 'var(--bg)',
    borderRadius: 99,
    fontSize: '0.82rem',
    color: 'var(--gray-700)',
    fontWeight: 500,
    border: '1px solid var(--border)',
  },
  headerUserDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--green-500)',
  },
  content: {
    flex: 1,
    padding: '28px 28px',
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
  },
  analyzeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 24,
  },
  analyzeMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  analyzeActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  readyBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'var(--green-100)',
    border: '1px solid #bbf7d0',
    borderRadius: 10,
    fontSize: '0.88rem',
    color: 'var(--green-600)',
    fontWeight: 500,
  },
  analyzingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '24px',
    background: 'var(--blue-50)',
    border: '1px solid var(--blue-100)',
    borderRadius: 16,
  },
  analyzingTitle: {
    fontWeight: 600,
    color: 'var(--blue-700)',
    fontSize: '0.95rem',
  },
  analyzingDesc: {
    fontSize: '0.85rem',
    color: 'var(--blue-600)',
    marginTop: 3,
  },
  analyzeSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  tipsCard: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
  },
  tipsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--gray-700)',
    marginBottom: 16,
  },
  tipItem: {
    display: 'flex',
    gap: 12,
    marginBottom: 14,
  },
  tipNum: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'var(--blue-600)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  tipTitle: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--gray-700)',
  },
  tipDesc: {
    fontSize: '0.78rem',
    color: 'var(--gray-500)',
    lineHeight: 1.5,
    marginTop: 2,
  },
  recentCard: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
  },
  recentTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--gray-700)',
    marginBottom: 12,
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '8px 10px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition)',
    marginBottom: 4,
    textAlign: 'left',
  },
  recentFileName: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--gray-700)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 170,
    marginBottom: 3,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '7px 14px',
    borderRadius: 8,
    background: 'white',
    border: '1px solid var(--border)',
    color: 'var(--gray-600)',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: 20,
    transition: 'var(--transition)',
  },
}
