import { useState, useRef } from 'react'

export default function UploadCard({ onUpload, loading, uploadStatus }) {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }
    setSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleInputChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (selectedFile && !loading) {
      onUpload(selectedFile)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardIconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div>
          <div style={styles.cardTitle}>Upload Medical Report</div>
          <div style={styles.cardSub}>PDF files only • Max 20MB</div>
        </div>
      </div>

      {!selectedFile ? (
        <div
          style={{
            ...styles.dropZone,
            ...(dragging ? styles.dropZoneActive : {}),
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          <div style={styles.dropIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="13" x2="12" y2="18"/>
              <polyline points="9 16 12 13 15 16"/>
            </svg>
          </div>
          <div style={styles.dropTitle}>
            {dragging ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
          </div>
          <div style={styles.dropSub}>Supports PDF medical reports, lab results, imaging</div>
          <button
            type="button"
            style={styles.browseBtn}
            onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div style={styles.filePreview} className="animate-fade-in">
          <div style={styles.fileIconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div style={styles.fileInfo}>
            <div style={styles.fileName}>{selectedFile.name}</div>
            <div style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB • PDF Document</div>
          </div>
          <button onClick={handleRemove} style={styles.removeBtn} title="Remove file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {uploadStatus && (
        <div style={{ ...styles.statusBar, ...(uploadStatus === 'success' ? styles.statusSuccess : uploadStatus === 'error' ? styles.statusError : styles.statusUploading) }} className="animate-fade-in">
          {uploadStatus === 'uploading' && (
            <>
              <span style={styles.miniSpinner} />
              Uploading report...
            </>
          )}
          {uploadStatus === 'success' && (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Report uploaded successfully
            </>
          )}
          {uploadStatus === 'error' && (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Upload failed — please try again
            </>
          )}
        </div>
      )}

      {selectedFile && uploadStatus !== 'success' && (
        <button
          style={{
            ...styles.uploadBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.btnRow}>
              <span style={styles.btnSpinner} />
              Uploading...
            </span>
          ) : (
            <span style={styles.btnRow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Report
            </span>
          )}
        </button>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: 'var(--blue-50)',
    border: '1px solid var(--blue-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--blue-600)',
    flexShrink: 0,
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--gray-800)',
  },
  cardSub: {
    fontSize: '0.78rem',
    color: 'var(--gray-400)',
    marginTop: 2,
  },
  dropZone: {
    border: '2px dashed var(--border)',
    borderRadius: 12,
    padding: '40px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  dropZoneActive: {
    borderColor: 'var(--blue-400)',
    background: 'var(--blue-50)',
  },
  dropIcon: {
    width: 68,
    height: 68,
    borderRadius: 16,
    background: 'var(--blue-50)',
    border: '1px solid var(--blue-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--blue-500)',
    marginBottom: 4,
  },
  dropTitle: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--gray-700)',
  },
  dropSub: {
    fontSize: '0.78rem',
    color: 'var(--gray-400)',
  },
  browseBtn: {
    marginTop: 8,
    padding: '7px 18px',
    borderRadius: 8,
    background: 'var(--blue-600)',
    color: 'white',
    fontSize: '0.82rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginBottom: 0,
  },
  fileIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: 'var(--red-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#dc2626',
    flexShrink: 0,
  },
  fileInfo: { flex: 1, minWidth: 0 },
  fileName: {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--gray-800)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
    marginTop: 2,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'var(--gray-100)',
    color: 'var(--gray-400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: '0.82rem',
    fontWeight: 500,
    marginTop: 14,
  },
  statusSuccess: {
    background: 'var(--green-100)',
    color: 'var(--green-600)',
  },
  statusError: {
    background: 'var(--red-100)',
    color: 'var(--red-600)',
  },
  statusUploading: {
    background: 'var(--blue-50)',
    color: 'var(--blue-600)',
  },
  miniSpinner: {
    width: 14,
    height: 14,
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  uploadBtn: {
    width: '100%',
    marginTop: 16,
    padding: '12px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    borderRadius: 10,
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    transition: 'var(--transition)',
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnSpinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
}
