import { useEffect, useState } from 'react'

const typeStyles = {
  success: {
    background: 'white',
    borderLeft: '4px solid var(--green-500)',
    iconColor: 'var(--green-500)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  error: {
    background: 'white',
    borderLeft: '4px solid var(--red-500)',
    iconColor: 'var(--red-500)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  info: {
    background: 'white',
    borderLeft: '4px solid var(--blue-500)',
    iconColor: 'var(--blue-500)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
  },
}

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)
  const t = typeStyles[type] || typeStyles.info

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        ...styles.toast,
        ...{ background: t.background, borderLeft: t.borderLeft },
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <span style={{ color: t.iconColor, display: 'flex', flexShrink: 0 }}>
        {t.icon}
      </span>
      <span style={styles.message}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} style={styles.closeBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '13px 16px',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
    maxWidth: 360,
    minWidth: 260,
    animation: 'toastIn 0.3s ease',
  },
  message: {
    flex: 1,
    fontSize: '0.85rem',
    color: 'var(--gray-700)',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  closeBtn: {
    display: 'flex',
    flexShrink: 0,
    color: 'var(--gray-400)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    borderRadius: 4,
    transition: 'var(--transition)',
  },
}
