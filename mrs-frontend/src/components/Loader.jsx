export default function Loader({ size = 32, color = 'var(--blue-600)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid var(--blue-100)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
        flexShrink: 0,
      }} />
    </div>
  )
}
